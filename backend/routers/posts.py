from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, exists, and_
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

@router.post('/toggle-like/{post_id}')
async def like_post(*, post_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    liked = db.query(models.Like).filter(models.Like.liker_id == user.id, models.Like.post_id == post_id).first()
    if liked:
        db.delete(liked)
    else:
        like_instance = models.Like(
            liker_id=user.id,
            post_id=post_id,
        )
        db.add(like_instance)
    db.commit()

@router.get('/likers/{post_id}')
async def like_post(*, post_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    likers = db.query(models.Like.liker_id).filter(models.Like.post_id == post_id).all()
    liker_profiles = []
    for liker in likers:
        profile = (
            db.query(
                models.User.last_name,
                models.User.first_name,
                models.User.profile_picture,
                models.User.batch_year,
                models.Course.code
            )
            .join(models.User.course)  # Use the relationship for the join
            .filter(models.User.id == liker)
            .first()
        )
        liker_profiles.append(profile)
    return  liker_profiles

@router.post('/comment/{post_id}')
async def post_comment(*, post_id: UUID, content: str, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    comment = models.Comment(
        commenter_id=user.id,
        post_id=post_id,
        comment = content,
    )
    db.add(comment)
    db.commit()

@router.get('/comment/{comment_id}')
async def view_comment(*, comment_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    return comment


@router.delete('/comment/{comment_id}')
async def delete_comment(*, comment_id: UUID, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.commenter_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this comment")

    db.delete(comment)
    db.commit()

    return {"detail": "Comment deleted successfully"}


@router.put('/comment/{comment_id}')
async def edit_comment(*, comment_id: UUID, content: str, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.commenter_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to edit this comment")

    comment.comment = content
    db.commit()

    return {"detail": "Comment edited successfully"}


@router.get('/fetch-comments/{post_id}/{offset}')
def fetch_comments(*, post_id: UUID, offset: int = 0, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    total_limit = 10  # Total items to fetch per offset
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).offset(offset).limit(total_limit).all()
    return comments

    
# @router.get('/fetch-post/{post_offset}/{esis_offset}/{type}')
# def fetch_posts(*, post_offset: int, esis_offset: int, type: str = '', db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
#     post_limit = 7  # Number of posts to fetch from models.Post
#     esis_limit = 3  # Number of announcements to fetch from models.ESISAnnouncement
#     total_limit = 10  # Total items to fetch per offset

#     user_session = db.query(models.User).filter(models.User.id == user.id).first()
#     # Check if user is not completed and has a 'public' role, then filter out event and fundraising type posts
#     if not user_session.is_completed and user_session.role == 'public':
#         posts_query = db.query(models.Post) \
#             .join(models.User, models.User.id == models.Post.uploader_id) \
#             .filter(~models.Post.post_type.in_(['event', 'fundraising'])) \
#             .order_by(models.Post.updated_at.desc())
#     else:
#         posts_query = db.query(models.Post) \
#             .join(models.User, models.User.id == models.Post.uploader_id) \
#             .order_by(models.Post.updated_at.desc())

#     if type != 'all':
#         posts_query = posts_query.filter(models.Post.post_type == type)

#     posts = posts_query.slice(post_offset, post_offset + post_limit).all()
#     esis_announcements = None
#     if type == 'announcement' or type == 'all':
#         esis_announcements = db.query(models.ESISAnnouncement).filter(models.ESISAnnouncement.IsLive == True) \
#             .order_by(models.ESISAnnouncement.Updated.desc()) \
#             .slice(esis_offset, esis_offset + esis_limit).all()

#         if not posts and not esis_announcements:
#             raise HTTPException(status_code=200, detail="No Post to Show")

#     if not posts and not type == 'announcement' and not type == 'all':
#         raise HTTPException(status_code=200, detail="No Post to Show")

#     remaining_items = total_limit - len(posts)
#     result = []
#     post_count = 0
#     esis_count = 0

#     while post_count + esis_count < total_limit and (posts or esis_announcements):
#         if post_count < post_limit and posts:
#             post = posts.pop(0)
#             liked = db.query(exists().where(models.Like.liker_id == user.id, models.Like.post_id == post.id)).scalar()
#             like_count = db.query(func.count(models.Like.liker_id)).filter(models.Like.post_id == post.id).scalar()
#             comment_count = db.query(func.count(models.Comment.commenter_id)).filter(models.Comment.post_id == post.id).scalar()
#             post_dict = {
#                 'id': post.id,
#                 'created_at': post.created_at,
#                 'updated_at': post.updated_at,
#                 'title': post.title,
#                 'content': post.content,
#                 'post_type': post.post_type,
#                 'img_link': post.img_link,
#                 'is_esis': False,
#                 'liked': liked,
#                 'likes': like_count,
#                 'comments': comment_count,
#                 'uploader': {
#                     'id': post.uploader_id,
#                     'last_name': post.uploader.last_name,
#                     'first_name': post.uploader.first_name,
#                     'username': post.uploader.username,
#                     'profile_picture': post.uploader.profile_picture,
#                 },
#                 'content_date': post.content_date if isinstance(post, models.Event) else None,
#                 'end_date': post.end_date if isinstance(post, models.Event) else None,
#                 'interested_count': post.interested_count if isinstance(post, models.Event) else None,
#                 'goal_amount': post.goal_amount if isinstance(post, models.Fundraising) else None,
#                 'total_collected': post.total_collected if isinstance(post, models.Fundraising) else None,
#                 'fulfilled': post.fulfilled if isinstance(post, models.Fundraising) else None,
#                 'donors_count': post.donors_count if isinstance(post, models.Fundraising) else None,
#             }
#             result.append(post_dict)
#             post_count += 1
#         elif type == 'announcement' or type == 'all' and esis_count < remaining_items and esis_announcements:
#             esis_announcement = esis_announcements.pop(0)
#             esis_dict = {
#                 'id': esis_announcement.AnnouncementId,
#                 'created_at': esis_announcement.Created,
#                 'updated_at': esis_announcement.Updated,
#                 'title': esis_announcement.Title,
#                 'content': esis_announcement.Content,
#                 'post_type': 'announcement',
#                 'img_link': esis_announcement.ImageUrl,
#                 'is_esis': True,
#             }
#             result.append(esis_dict)
#             esis_count += 1

#     return result

@router.get('/fetch-post/{post_offset}/{esis_offset}/{type}')
def fetch_posts(*, post_offset: int, esis_offset: int, type: str = '', db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post_limit = 7  # Number of posts to fetch from models.Post
    esis_limit = 3  # Number of announcements to fetch from models.ESISAnnouncement
    total_limit = 10  # Total items to fetch per offset

    # Fetch posts
    posts_query = db.query(models.Post) \
                    .join(models.User, models.User.id == models.Post.uploader_id) \
                    .order_by(models.Post.updated_at.desc())

    # Apply filters based on user session
    if not user.is_completed and user.role == 'public':
        posts_query = posts_query.filter(~models.Post.post_type.in_(['event', 'fundraising']))

    if type != 'all':
        posts_query = posts_query.filter(models.Post.post_type == type)

    # Pre-fetch counts for likes and comments
    subquery_likes = (
        select([func.count(models.Like.liker_id).label("like_count"), models.Like.post_id])
        .group_by(models.Like.post_id)
        .subquery()
    )
    subquery_comments = (
        select([func.count(models.Comment.commenter_id).label("comment_count"), models.Comment.post_id])
        .group_by(models.Comment.post_id)
        .subquery()
    )

    posts_query = posts_query \
        .outerjoin(subquery_likes, subquery_likes.c.post_id == models.Post.id) \
        .outerjoin(subquery_comments, subquery_comments.c.post_id == models.Post.id) \
        .add_columns(subquery_likes.c.like_count, subquery_comments.c.comment_count)

    posts = posts_query.offset(post_offset).limit(post_limit).all()

    # Fetch ESIS announcements
    esis_announcements = None
    if type == 'announcement' or type == 'all':
        esis_announcements = db.query(models.ESISAnnouncement) \
                                .filter(models.ESISAnnouncement.IsLive == True) \
                                .order_by(models.ESISAnnouncement.Updated.desc()) \
                                .offset(esis_offset).limit(esis_limit).all()

    # Combine results
    combined_results = []
    combined_results.extend(posts)
    combined_results.extend(esis_announcements)

    # Sort combined results by updated_at
    combined_results.sort(key=lambda item: item.updated_at, reverse=True)

    # Process results
    result = []
    for item in combined_results[:total_limit]:
        item_dict = {
            'id': item.id,
            'created_at': item.created_at,
            'updated_at': item.updated_at,
            'title': item.title,
            'content': item.content,
            'post_type': item.post_type,
            'img_link': item.img_link,
            'is_esis': isinstance(item, models.ESISAnnouncement),
            'uploader': {
                'id': item.uploader_id,
                'last_name': item.uploader.last_name,
                'first_name': item.uploader.first_name,
                'username': item.uploader.username,
                'profile_picture': item.uploader.profile_picture,
            },
            'content_date': item.content_date if isinstance(item, models.Event) else None,
            'end_date': item.end_date if isinstance(item, models.Event) else None,
            'interested_count': item.interested_count if isinstance(item, models.Event) else None,
            'goal_amount': item.goal_amount if isinstance(item, models.Fundraising) else None,
            'total_collected': item.total_collected if isinstance(item, models.Fundraising) else None,
            'fulfilled': item.fulfilled if isinstance(item, models.Fundraising) else None,
            'donors_count': item.donors_count if isinstance(item, models.Fundraising) else None,
            'liked': item.like_count if isinstance(item, models.Post) else None,
            'likes': item.like_count if isinstance(item, models.Post) else None,
            'comments': item.comment_count if isinstance(item, models.Post) else None,
        }
        result.append(item_dict)

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