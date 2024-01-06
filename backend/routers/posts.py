from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, List, Optional
from starlette import status
from backend.schemas import UserResponse
from backend import models
import cloudinary.uploader
import pandas as pd
import os

router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/create-post')
async def create_post(title: str = Form(...), content: str = Form(...), content_date: Optional[date] = Form(None), post_type: str = Form(...), video_link: Optional[str] = Form(None), img: Optional[UploadFile] = File(None), goal_amount: Optional[int] = Form(None), end_date: Optional[date] = Form(None), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  if post_type == "event" and content_date is not None:
    post = models.Event(
            title=title,
            content=content,
            content_date=content_date,
            post_type=post_type,
            video_link = video_link or '',
            uploader_id = user.id,
            event_date=content_date,
            end_date=end_date,
          )
  elif post_type == "fundraising" and goal_amount is not None:
    post = models.Fundraising(
            title=title,
            content=content,
            content_date=content_date,
            post_type=post_type,
            video_link = video_link or '',
            uploader_id = user.id,
            goal_amount=goal_amount,
          )
  elif post_type == 'news' or post_type == 'announcement':
    post = models.Post(
      title=title,
      content=content,
      content_date=content_date,
      post_type=post_type,
      video_link = video_link or '',
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

@router.get('/fetch-post')
def fetch_posts(offset: int = 0, placing: int = 1, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  limit = 10
  start = offset * placing
  end = start + limit

  posts = db.query(models.Post)\
  .join(models.User, models.User.id == models.Post.uploader_id)\
  .filter(models.Post.deleted_at.is_(None))\
  .slice(start, end)\
  .all()
  if not posts:
      raise HTTPException(status_code=404, detail="No posts found")
  
  result = []

  for post in posts:
    post_dict = {
      'id': post.id,
      'created_at': post.created_at,
      'updated_at': post.updated_at,
      'title': post.title,
      'content': post.content,
      'content_date': post.content_date,
      'post_type': post.post_type,
      'img_link': post.img_link,
      'video_link': post.video_link,
      'uploader': {
        'id': post.uploader_id,
        'last_name': post.uploader.last_name,
        'first_name': post.uploader.first_name,
        'username': post.uploader.username,
        'profile_picture': post.uploader.profile_picture,
      },
      'event_date': post.event_date if isinstance(post, models.Event) else None,
      'end_date': post.end_date if isinstance(post, models.Event) else None,
      'interested_count': post.interested_count if isinstance(post, models.Event) else None,
      'goal_amount': post.goal_amount if isinstance(post, models.Fundraising) else None,
      'total_collected': post.total_collected if isinstance(post, models.Fundraising) else None,
      'fulfilled': post.fulfilled if isinstance(post, models.Fundraising) else None,
      'donors_count': post.donors_count if isinstance(post, models.Fundraising) else None,
    }
    result.append(post_dict)

  return result

@router.put("/edit-post/{post_id}")
async def edit_post(post_id: UUID, title: Optional[str] = Form(None), content: Optional[str] = Form(None), content_date: Optional[date] = Form(None), post_type: Optional[str] = Form(None), video_link: Optional[str] = Form(None), img: Optional[UploadFile] = File(None), goal_amount: Optional[int] = Form(None), event_date: Optional[date] = Form(None), end_date: Optional[date] = Form(None), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
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

    if img:
        contents = await img.read()
        filename = img.filename
        folder = "Posts"
        result = cloudinary.uploader.upload(contents, public_id=f"{folder}/{filename}", tags=[f'post_img{post.id}'])
        post.img_link = result.get("url")

    db.commit()


@router.put("/delete-post/{post_id}")
async def delete_post(post_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.deleted_at = datetime.utcnow()
    db.commit()

