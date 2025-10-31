class Api::AuthorsController < Api::ApplicationController
  def index
    authors = current_user.authors
    render json: authors
  end

  def create
    author = current_user.authors.build(author_params)
    if author.save
      render json: author, status: :created
    else
      render json: { errors: author.errors }, status: :unprocessable_entity
    end
  end

  def update
    author = current_user.authors.find(params[:id])
    if author.update(author_params)
      render json: author, status: :ok
    else
      render json: { errors: author.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    author = current_user.authors.find(params[:id])

    if author.books.exists?
      render json: {
        error: "使用されているため削除できません"
      }, status: :unprocessable_entity
    else
      if author.destroy
        head :no_content
      else
        render json: { errors: author.errors }, status: :unprocessable_entity
      end
    end
  end

  private
  
  def author_params
    params.require(:author).permit(:name)
  end
end
