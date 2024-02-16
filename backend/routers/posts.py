from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, exists, and_, select
from backend.oauth2 import get_current_user
from typing import Union
from backend import models
from typing import Annotated, List, Optional, Union
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
async def like_post(
    *,
    post_id: Union[UUID, int],
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    liked = None

    if isinstance(post_id, int):
        liked = db.query(models.Like).filter(models.Like.liker_id == user.id, models.Like.esis_post_id == post_id).first()
    elif isinstance(post_id, UUID):
        liked = db.query(models.Like).filter(models.Like.liker_id == user.id, models.Like.post_id == post_id).first()

    if liked:
        db.delete(liked)
    else:
        like_instance = models.Like(
            liker_id=user.id,
            post_id=post_id if isinstance(post_id, UUID) else None,
            esis_post_id=post_id if isinstance(post_id, int) else None,
        )
        db.add(like_instance)

    db.commit()

@router.get('/likers/{post_id}')
async def like_post(*, post_id: Union[int, UUID], db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if isinstance(post_id, int):
        liker_profiles = (
            db.query(
                models.User.last_name,
                models.User.first_name,
                models.User.profile_picture,
                models.User.batch_year,
                models.Course.code
            )
            .join(models.Like, models.Like.liker_id == models.User.id)
            .join(models.User.course)
            .filter(models.Like.esis_post_id == post_id)
            .all()
        )

    elif isinstance(post_id, UUID):
        liker_profiles = (
            db.query(
                models.User.last_name,
                models.User.first_name,
                models.User.profile_picture,
                models.User.batch_year,
                models.Course.code
            )
            .join(models.Like, models.Like.liker_id == models.User.id)
            .join(models.User.course)
            .filter(models.Like.post_id == post_id)
            .all()
        )

    return liker_profiles

@router.post('/comment/')
async def post_comment(*, post_id: Union[int, UUID] = Form(...), content: str = Form(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if isinstance(post_id, int):
        comment = models.Comment(
            commenter_id=user.id,
            esis_post_id=post_id,
            comment = content,
        )
    elif isinstance(post_id, UUID):
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
async def edit_comment(*, comment_id: UUID, content: str = Form(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.commenter_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to edit this comment")

    comment.comment = content
    comment.updated_at = datetime.utcnow()

    db.commit()

    return {"detail": "Comment Edited Successfully"}


@router.get('/fetch-comments/{offset}/{post_id}')
def fetch_comments(*, post_id: Union[int, UUID], offset: int = 0, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    total_limit = 5  # Total items to fetch per offset
    if isinstance(post_id, int):
        comments = (
            db.query(
                models.Comment.id,
                models.Comment.comment,
                models.Comment.created_at,
                models.Comment.updated_at,
                models.User.id.label("commenter_id"),
                models.User.last_name,
                models.User.first_name,
                models.User.profile_picture,
                models.User.batch_year,
                models.Course.code,
                (models.User.id == user.id).label("editable"),
            )
            .join(models.Comment.commenter)
            .join(models.User.course)
            .filter(models.Comment.esis_post_id == post_id)
            .order_by(models.Comment.updated_at.desc()) 
            .offset(offset)
            .limit(total_limit)
            .all()
        )

    elif isinstance(post_id, UUID):
        comments = (
            db.query(
                models.Comment.id,
                models.Comment.comment,
                models.Comment.created_at,
                models.Comment.updated_at,
                models.User.id.label("commenter_id"),
                models.User.last_name,
                models.User.first_name,
                models.User.profile_picture,
                models.User.batch_year,
                models.Course.code,
                (models.User.id == user.id).label("editable"),
            )
            .join(models.Comment.commenter)
            .join(models.User.course)
            .filter(models.Comment.post_id == post_id)
            .order_by(models.Comment.updated_at.desc()) 
            .offset(offset)
            .limit(total_limit)
            .all()
        )

    if not comments:
        raise HTTPException(status_code=200, detail="You've Reached the End")

    return comments


@router.get('/view-post/{post_id}')
def fetch_specific_post(post_id: Union[int, UUID], db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if isinstance(post_id, int):
        post = (
            db.query(models.ESISAnnouncement)
            .outerjoin(models.Like, models.Like.esis_post_id == models.ESISAnnouncement.AnnouncementId)
            .outerjoin(models.Comment, models.Comment.esis_post_id == models.ESISAnnouncement.AnnouncementId)
            .filter(models.ESISAnnouncement.AnnouncementId == post_id)
            .first()
        )
        if not post:
            raise HTTPException(status_code=404, detail="No post found")

        liked = any(like.liker_id == user.id for like in post.like) if post.like else False
        like_count = len(post.like) if post.like else 0
        comment_count = len(post.comment) if post.comment else 0

        post_dict = {
            'id': post.AnnouncementId,
            'created_at': post.Created,
            'updated_at': post.Updated,
            'title': post.Title,
            'content': post.Content,
            'post_type': 'announcement',
            'img_link': post.ImageUrl,
            'is_esis': True,
            'liked': liked,
            'likes': like_count,
            'comments': comment_count,
        }

    elif isinstance(post_id, UUID):
        post = (
            db.query(models.Post)
            .outerjoin(models.Like, models.Like.post_id == models.Post.id)
            .outerjoin(models.Comment, models.Comment.post_id == models.Post.id)
            .join(models.User, models.User.id == models.Post.uploader_id)
            .filter(models.Post.id == post_id)
            .first()
        )
        if not post:
            raise HTTPException(status_code=404, detail="No post found")

        liked = any(like.liker_id == user.id for like in post.like) if post.like else False
        like_count = len(post.like) if post.like else 0
        comment_count = len(post.comment) if post.comment else 0

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
            'liked': liked,
            'likes': like_count,
            'comments': comment_count,
        }

    return post_dict
    
@router.get('/fetch-post/{post_offset}/{esis_offset}/{type}')
def fetch_posts(*, post_offset: int, esis_offset: int, type: str = '',  liked_post_id: int = None, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    post_limit = 7  # Number of posts to fetch from models.Post
    esis_limit = 3  # Number of announcements to fetch from models.ESISAnnouncement
    total_limit = 10  # Total items to fetch per offset

    user_session = db.query(models.User).filter(models.User.id == user.id).first()

    base_query = (
        db.query(models.Post)
        .join(models.User, models.User.id == models.Post.uploader_id)
        .order_by(models.Post.updated_at.desc())
    )

    # Apply additional filters based on user's completion and role
    if not user_session.is_completed and user_session.role == 'public':
        base_query = base_query.filter(~models.Post.post_type.in_(['event', 'fundraising']))

    if type != 'all':
        base_query = base_query.filter(models.Post.post_type == type)

    posts_query = base_query.offset(post_offset).limit(post_limit)

    # # Check if a specific post was liked or unliked
    # if liked_post_id:
    #     liked_post = (
    #         posts_query
    #         .options(
    #             joinedload(models.Post.like, innerjoin=False).load_only("liker_id"),
    #             joinedload(models.Post.comment, innerjoin=False).load_only("commenter_id"),
    #         )
    #         .filter(models.Post.id == liked_post_id)
    #         .first()
    #     )

    #     if liked_post:
    #         liked = any(like.liker_id == user.id for like in liked_post.like) if liked_post.like else False
    #         like_count = len(liked_post.like) if liked_post.like else 0
    #         comment_count = len(liked_post.comment) if liked_post.comment else 0

    #         liked_post_dict = {
    #             'id': liked_post.id,
    #             'created_at': liked_post.created_at,
    #             'updated_at': liked_post.updated_at,
    #             'title': liked_post.title,
    #             'content': liked_post.content,
    #             'post_type': liked_post.post_type,
    #             'img_link': liked_post.img_link,
    #             'is_esis': False,
    #             'liked': liked,
    #             'likes': like_count,
    #             'comments': comment_count,
    #             'uploader': {
    #                 'id': liked_post.uploader_id,
    #                 'last_name': liked_post.uploader.last_name,
    #                 'first_name': liked_post.uploader.first_name,
    #                 'username': liked_post.uploader.username,
    #                 'profile_picture': liked_post.uploader.profile_picture,
    #             },
    #             'content_date': liked_post.content_date if isinstance(liked_post, models.Event) else None,
    #             'end_date': liked_post.end_date if isinstance(liked_post, models.Event) else None,
    #             'interested_count': liked_post.interested_count if isinstance(liked_post, models.Event) else None,
    #             'goal_amount': liked_post.goal_amount if isinstance(liked_post, models.Fundraising) else None,
    #             'total_collected': liked_post.total_collected if isinstance(liked_post, models.Fundraising) else None,
    #             'fulfilled': liked_post.fulfilled if isinstance(liked_post, models.Fundraising) else None,
    #             'donors_count': liked_post.donors_count if isinstance(liked_post, models.Fundraising) else None,
    #         }
    #         return [liked_post_dict]

    posts_with_likes_comments = (
        posts_query
        .options(
            joinedload(models.Post.like, innerjoin=False).load_only("liker_id"),
            joinedload(models.Post.comment, innerjoin=False).load_only("commenter_id"),
        )
        .all()
    )

    posts = posts_query.slice(post_offset, post_offset + post_limit).all()
    esis_announcements = None   
    if type == 'announcement' or type == 'all':
        esis_announcements = db.query(models.ESISAnnouncement).filter(models.ESISAnnouncement.IsLive == True) \
            .order_by(models.ESISAnnouncement.Updated.desc()) \
            .options(
            joinedload(models.ESISAnnouncement.like, innerjoin=False).load_only("liker_id"),
            joinedload(models.ESISAnnouncement.comment, innerjoin=False).load_only("commenter_id"))\
            .slice(esis_offset, esis_offset + esis_limit).all()

        if not posts and not esis_announcements:
            raise HTTPException(status_code=200, detail="No Post to Show")

    if not posts and not type == 'announcement' and not type == 'all':
        raise HTTPException(status_code=200, detail="No Post to Show")

    remaining_items = total_limit - len(posts)
    result = []
    post_count = 0
    esis_count = 0

    while post_count + esis_count < total_limit and (posts_with_likes_comments or esis_announcements):
        if post_count < post_limit and posts_with_likes_comments:
            post = posts_with_likes_comments.pop(0)
            liked = any(like.liker_id == user.id for like in post.like) if post.like else False
            like_count = len(post.like) if post.like else 0
            comment_count = len(post.comment) if post.comment else 0

            post_dict = {
                'id': post.id,
                'created_at': post.created_at,
                'updated_at': post.updated_at,
                'title': post.title,
                'content': post.content,
                'post_type': post.post_type,
                'img_link': post.img_link,
                'is_esis': False,
                'liked': liked,
                'likes': like_count,
                'comments': comment_count,
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
        elif type in ('announcement', 'all') and esis_count < remaining_items and esis_announcements:
            esis_announcement = esis_announcements.pop(0)
            liked = any(like.liker_id == user.id for like in esis_announcement.like) if esis_announcement.like else False
            like_count = len(esis_announcement.like) if esis_announcement.like else 0
            comment_count = len(esis_announcement.comment) if esis_announcement.comment else 0
            esis_dict = {
                'id': esis_announcement.AnnouncementId,
                'created_at': esis_announcement.Created,
                'updated_at': esis_announcement.Updated,
                'title': esis_announcement.Title,
                'content': esis_announcement.Content,
                'post_type': 'announcement',
                'img_link': esis_announcement.ImageUrl,
                'is_esis': True,
                'liked': liked,
                'likes': like_count,
                'comments': comment_count,
            }
            result.append(esis_dict)
            esis_count += 1

    return result

# @router.get('/fetch-post/{post_offset}/{esis_offset}/{type}')
# def fetch_posts(*, post_offset: int, esis_offset: int, type: str = '', db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
#     post_limit = 7  # Number of posts to fetch from models.Post
#     esis_limit = 3  # Number of announcements to fetch from models.ESISAnnouncement
#     total_limit = 10  # Total items to fetch per offset

#     user_session = db.query(models.User).filter(models.User.id == user.id).first()

#     # Fetch posts
#     posts_query = db.query(models.Post) \
#                     .join(models.User, models.User.id == models.Post.uploader_id) \
#                     .order_by(models.Post.updated_at.desc())
    

#     # Apply filters based on user session
#     if not user_session.is_completed and user.role == 'public':
#         posts_query = posts_query.filter(~models.Post.post_type.in_(['event', 'fundraising']))

#     if type != 'all':
#         posts_query = posts_query.filter(models.Post.post_type == type)

#     # Pre-fetch counts for likes and comments
#     subquery_likes = (
#         select([func.count(models.Like.liker_id).label("like_count"), models.Like.post_id])
#         .group_by(models.Like.post_id)
#         .subquery()
#     )
#     subquery_comments = (
#         select([func.count(models.Comment.commenter_id).label("comment_count"), models.Comment.post_id])
#         .group_by(models.Comment.post_id)
#         .subquery()
#     )

#     posts_query = posts_query \
#         .outerjoin(subquery_likes, subquery_likes.c.post_id == models.Post.id) \
#         .outerjoin(subquery_comments, subquery_comments.c.post_id == models.Post.id) \
#         .add_columns(subquery_likes.c.like_count, subquery_comments.c.comment_count)

#     posts = posts_query.offset(post_offset).limit(post_limit).all()

#     # Fetch ESIS announcements
#     esis_announcements = None
#     if type == 'announcement' or type == 'all':
#         esis_announcements = db.query(models.ESISAnnouncement) \
#                                 .filter(models.ESISAnnouncement.IsLive == True) \
#                                 .order_by(models.ESISAnnouncement.Updated.desc()) \
#                                 .offset(esis_offset).limit(esis_limit).all()

#     # Combine results
#     combined_results = []
#     combined_results.extend(posts)
#     combined_results.extend(esis_announcements)

#     # Sort combined results by updated_at
#     combined_results.sort(key=lambda item: item.updated_at, reverse=True)

#     # Process results
#     result = []
#     for item in combined_results[:total_limit]:
#         item_dict = {
#             'id': item.id,
#             'created_at': item.created_at,
#             'updated_at': item.updated_at,
#             'title': item.title,
#             'content': item.content,
#             'post_type': item.post_type,
#             'img_link': item.img_link,
#             'is_esis': isinstance(item, models.ESISAnnouncement),
#             'uploader': {
#                 'id': item.uploader_id,
#                 'last_name': item.uploader.last_name,
#                 'first_name': item.uploader.first_name,
#                 'username': item.uploader.username,
#                 'profile_picture': item.uploader.profile_picture,
#             },
#             'content_date': item.content_date if isinstance(item, models.Event) else None,
#             'end_date': item.end_date if isinstance(item, models.Event) else None,
#             'interested_count': item.interested_count if isinstance(item, models.Event) else None,
#             'goal_amount': item.goal_amount if isinstance(item, models.Fundraising) else None,
#             'total_collected': item.total_collected if isinstance(item, models.Fundraising) else None,
#             'fulfilled': item.fulfilled if isinstance(item, models.Fundraising) else None,
#             'donors_count': item.donors_count if isinstance(item, models.Fundraising) else None,
#             'liked': item.like_count if isinstance(item, models.Post) else None,
#             'likes': item.like_count if isinstance(item, models.Post) else None,
#             'comments': item.comment_count if isinstance(item, models.Post) else None,
#         }
#         result.append(item_dict)

#     return result

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
    