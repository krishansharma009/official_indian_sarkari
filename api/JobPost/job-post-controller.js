const JobPost = require("./job-post");
const REST_API = require("../../utils/crudHelper");

const createJobPost = async (req, res) => {
  const response = await REST_API._add(req, res, JobPost);
  res.status(200).json(response);
};

const getJobPostList = async (req, res) => {
  const response = await REST_API._getAll(req, res, JobPost);
  res.status(200).json(response);
};

const getJobPostById = async (req, res) => {
  const { id } = req.params;
  const response = await REST_API._getDataListById(req, res, JobPost, "id", id);
  res.status(201).json(response);
};

const updateJobPost = async (req, res) => {
  const response = await REST_API._update(req, res, JobPost);
  res.status(201).json(response);
};

const deleteJobPost = async (req, res) => {
  const response = await REST_API._delete(req, res, JobPost);
  res.status(201).json(response);
};

module.exports = {
  createJobPost,
  getJobPostList,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};
