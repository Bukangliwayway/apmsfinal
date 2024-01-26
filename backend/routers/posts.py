from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from backend.oauth2 import get_current_user
from typing import Union
from backend import models
from typing import Annotated, List, Optional
from starlette import status
from backend.schemas import UserResponse
from backend import models
import cloudinary.uploader
from datetime import datetime

import pandas as pd
import os

router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/create-post')
async def create_post(title: str = Form(...), content: str = Form(...), content_date: Optional[date] = Form(None), post_type: str = Form(...), img: Optional[UploadFile] = File(None), goal_amount: Optional[int] = Form(None), end_date: Optional[date] = Form(None), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  admin = db.query(models.User).filter(models.User.id == user.id).first()
  if admin.role != 'admin':
    raise HTTPException(status_code=400, detail="Unauthorized")
    
  if post_type == "event" and content_date is not None:
    post = models.Event(
        title=title,
        content=content,
        post_type=post_type,
        uploader_id = user.id,
        content_date=content_date,
        end_date=end_date,
      )
  elif post_type == "fundraising":
    post = models.Fundraising(
        title=title,
        content=content,
        post_type=post_type,
        uploader_id = user.id,
        goal_amount=goal_amount if goal_amount else 0,
      )
  elif post_type == 'news':
    post = models.News(
      title=title,
      content=content,
      post_type=post_type,
      uploader_id = user.id,
    )
  elif post_type == 'announcement':
    post = models.Announcement(
      title=title,
      content=content,
      post_type=post_type,
      uploader_id = user.id,
    )
  else:
    raise HTTPException(status_code=400, detail='Invalid Post')
  
  db.add(post)
  db.commit()
  db.refresh(post)
  if img:
    contents = await img.read()
    filename = img.filename
    folder = "Posts"
    result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'post_img{post.id}'])
    post.img_link = result.get("url")
    db.commit()

@router.get('/fetch-post/{post_offset}/{esis_offset}/{type}')
def fetch_posts(*,   post_offset: int, esis_offset: int, type: str = '', db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post_limit = 7  # Number of posts to fetch from models.Post
    esis_limit = 3  # Number of announcements to fetch from models.ESISAnnouncement
    total_limit = 10  # Total items to fetch per offset

    posts_query = db.query(models.Post) \
        .join(models.User, models.User.id == models.Post.uploader_id) \
        .order_by(models.Post.updated_at.desc())

    if type != 'all':
        posts_query = posts_query.filter(models.Post.post_type == type)

    posts = posts_query.slice(post_offset, post_offset + post_limit).all()
    esis_announcements = None
    if type == 'announcement' or type == 'all':
        esis_announcements = db.query(models.ESISAnnouncement).filter(models.ESISAnnouncement.IsLive == True) \
            .order_by(models.ESISAnnouncement.Updated.desc()) \
            .slice(esis_offset, esis_offset + esis_limit).all()

        if not posts and not esis_announcements:
            raise HTTPException(status_code=200, detail="No Post to Show")
        
    if not posts and not type == 'announcement' and not type == 'all':
        raise HTTPException(status_code=200, detail="No Post to Show")

    remaining_items = total_limit - len(posts)
    result = []
    post_count = 0
    esis_count = 0

    while post_count + esis_count < total_limit and (posts or esis_announcements):
        if post_count < post_limit and posts:
            post = posts.pop(0)
            post_dict = {
                'id': post.id,
                'created_at': post.created_at,
                'updated_at': post.updated_at,
                'title': post.title,
                'content': post.content,
                'post_type': post.post_type,
                'img_link': post.img_link,
                'is_esis': False,
                'uploader': {
                    'id': post.uploader_id,
                    'last_name': post.uploader.last_name,
                    'first_name': post.uploader.first_name,
                    'username': post.uploader.username,
                    'profile_picture': post.uploader.profile_picture,
                },
                'content_date': post.content_date if isinstance(post, models.Event) else None,
                'end_date': post.end_date if isinstance(post, models.Event) else None,
                'interested_count': post.interested_count if isinstance(post, models.Event) else None,
                'goal_amount': post.goal_amount if isinstance(post, models.Fundraising) else None,
                'total_collected': post.total_collected if isinstance(post, models.Fundraising) else None,
                'fulfilled': post.fulfilled if isinstance(post, models.Fundraising) else None,
                'donors_count': post.donors_count if isinstance(post, models.Fundraising) else None,
            }
            result.append(post_dict)
            post_count += 1
        elif type == 'announcement' or type == 'all' and esis_count < remaining_items and esis_announcements:
            esis_announcement = esis_announcements.pop(0)
            esis_dict = {
                'id': esis_announcement.AnnouncementId,
                'created_at': esis_announcement.Created,
                'updated_at': esis_announcement.Updated,
                'title': esis_announcement.Title,
                'content': esis_announcement.Content,
                'post_type': 'announcement',
                'img_link': esis_announcement.ImageUrl,
                'is_esis': True,
            }
            result.append(esis_dict)
            esis_count += 1

    return result

@router.put("/edit-post/{post_id}")
async def edit_post(post_id: UUID, title: Optional[str] = Form(None), content: Optional[str] = Form(None), content_date: Optional[date] = Form(None), post_type: Optional[str] = Form(None), img: Optional[UploadFile] = File(None), goal_amount: Optional[int] = Form(None), end_date: Optional[date] = Form(None), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post_type:
        if post_type not in ["event", "fundraising", "news", "announcement"]:
            raise HTTPException(status_code=400, detail="Invalid post type")
        post.post_type = post_type

    updates = {k: v for k, v in locals().items() if v is not None and k not in ["post", "db", "user", "post_id", "img"]}
    for attr, value in updates.items():
        setattr(post, attr, value)
    
    # Explicitly set end_date to None if it's passed as None
    post.end_date = end_date

    if img:
        contents = await img.read()
        filename = img.filename
        folder = "Posts"
        result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'post_img{post.id}'])
        post.img_link = result.get("url")

    post.updated_at = datetime.utcnow()
    db.commit()


@router.delete("/delete-post/{post_id}")
async def delete_post(post_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()

@router.get('/view-post/{post_id}')
def fetch_specific_post(post_id: Union[int, UUID], db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if isinstance(post_id, int):
        post = db.query(models.ESISAnnouncement).filter(models.ESISAnnouncement.AnnouncementId == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="No post found")
        
        post_dict = {
            'id': post.AnnouncementId,
            'created_at': post.Created,
            'updated_at': post.Updated,
            'title': post.Title,
            'content': post.Content,
            'post_type': 'announcement',
            'img_link': post.ImageUrl,
            'is_esis': True,

        }
    
    elif isinstance(post_id, UUID):
        post = db.query(models.Post).join(models.User, models.User.id == models.Post.uploader_id).filter(models.Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="No post found")
        
        post_dict = {
            'id': post.id,
            'created_at': post.created_at,
            'updated_at': post.updated_at,
            'title': post.title,
            'content': post.content,
            'post_type': post.post_type,
            'img_link': post.img_link,
            'is_esis': False,
            'uploader': {
                'id': post.uploader_id,
                'last_name': post.uploader.last_name,
                'first_name': post.uploader.first_name,
                'username': post.uploader.username,
                'profile_picture': post.uploader.profile_picture,
            },
            'content_date': post.content_date if isinstance(post, models.Event) else None,
            'end_date': post.end_date if isinstance(post, models.Event) else None,
            'interested_count': post.interested_count if isinstance(post, models.Event) else None,
            'goal_amount': post.goal_amount if isinstance(post, models.Fundraising) else None,
            'total_collected': post.total_collected if isinstance(post, models.Fundraising) else None,
            'fulfilled': post.fulfilled if isinstance(post, models.Fundraising) else None,
            'donors_count': post.donors_count if isinstance(post, models.Fundraising) else None,
        }

    return post_dict