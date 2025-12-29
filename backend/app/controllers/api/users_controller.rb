module Api
  class UsersController < Api::ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

    def index
      query = params[:q].to_s.strip

      if query.blank?
        render json: []
        return
      end

      # 現在のユーザーを除外してユーザー名で部分一致検索
      users = User.where('name ILIKE ?', "%#{query}%")
                  .where.not(id: current_user.id)
                  .limit(20)
                  .order(:name)

      render json: users
    end

    def show
      user = User.find(params[:id])
      render json: user.as_json.merge(stats: user.stats)
    end

    def books
      user = User.find(params[:id])
      books = user.books.where(public: true).includes(:category, :tags).order(created_at: :desc)
      render json: books, include: %i[category tags]
    end

    def lists
      user = User.find(params[:id])
      lists = user.lists
                  .where(public: true)
                  .left_joins(list_books: :book)
                  .select('lists.*, COUNT(CASE WHEN books.public = true THEN 1 END) as books_count')
                  .group('lists.id')
                  .order(created_at: :desc)
      render json: lists
    end

    def follow
      user = User.find(params[:id])

      if current_user.id == user.id
        render json: {
          code: 'FOLLOW_SELF_ERROR',
          message: 'Cannot follow yourself'
        }, status: :unprocessable_content
        return
      end

      follow = current_user.active_follows.build(followed_id: user.id)

      if follow.save
        render json: { message: 'Followed successfully' }, status: :created
      else
        render json: {
          code: 'ALREADY_FOLLOWING',
          message: follow.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    end

    def unfollow
      user = User.find(params[:id])
      follow = current_user.active_follows.find_by(followed_id: user.id)

      if follow
        follow.destroy
        render json: { message: 'Unfollowed successfully' }, status: :ok
      else
        render json: {
          code: 'NOT_FOLLOWING',
          message: 'Not following this user'
        }, status: :not_found
      end
    end

    def following
      user = User.find(params[:id])
      following_users = user.following.order(created_at: :desc)
      render json: following_users
    end

    def followers
      user = User.find(params[:id])
      follower_users = user.followers.order(created_at: :desc)
      render json: follower_users
    end

    def follow_status
      user = User.find(params[:id])
      is_following = current_user.following.exists?(user.id)
      is_followed_by = current_user.followers.exists?(user.id)

      render json: {
        is_following: is_following,
        is_followed_by: is_followed_by
      }
    end

    private

    def record_not_found
      render json: { error: 'User not found' }, status: :not_found
    end
  end
end
