const ContentModel = require('../models/contentModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createContent = async (req, res) => {
  try {
    const { title, description, category_id, thumbnail, url } = req.body;
    // req.user is populated by authenticateToken
    const user_id = req.user ? (req.user.id || req.user.userId) : null;
    
    if (!title || !url) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Title and URL are required')
      );
    }

    // Tentukan content_type berdasarkan category_id
    let content_type = 'film';
    if (category_id === 1) content_type = 'berita';
    else if (category_id === 2) content_type = 'film';
    else if (category_id === 3) content_type = 'music';

    const content = await ContentModel.create({
      title,
      description,
      category_id,
      user_id,
      thumbnail,
      url,
      content_type
    });

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(content, 'Content created successfully')
    );
  } catch (error) {
    console.error('Create content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error creating content')
    );
  }
};

const getAllContents = async (req, res) => {
  try {
    const contents = await ContentModel.findAll();
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(contents, 'Contents retrieved successfully')
    );
  } catch (error) {
    console.error('Get all contents error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving contents')
    );
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment views setiap kali konten diambil (detail page)
    await ContentModel.incrementViews(id);
    
    const content = await ContentModel.findById(id);
    
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }
    
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(content, 'Content retrieved successfully')
    );
  } catch (error) {
    console.error('Get content by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving content')
    );
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const content = await ContentModel.findById(id);
    
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }
    
    const updated = await ContentModel.update(id, data);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Content updated successfully')
    );
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error updating content')
    );
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await ContentModel.findById(id);
    
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }
    
    await ContentModel.delete(id);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Content deleted successfully')
    );
  } catch (error) {
    console.error('Delete content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting content')
    );
  }
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent
};
