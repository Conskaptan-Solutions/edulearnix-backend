import api from './api';

// Jobs
export const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getGrouped: () => api.get('/jobs/grouped'),
  getById: (id) => api.get(`/jobs/${id}`),
  getBySlug: (slug) => api.get(`/jobs/slug/${slug}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  like: (id) => api.put(`/jobs/${id}/like`),
  getMyJobs: () => api.get('/jobs/my/jobs'),
};

// Resources
export const resourceService = {
  getAll: (params) => api.get('/resources', { params }),
  getGrouped: () => api.get('/resources/grouped'),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  like: (id) => api.put(`/resources/${id}/like`),
  download: (id) => api.put(`/resources/${id}/download`),
  getMyResources: () => api.get('/resources/my/resources'),
};

// Blogs
export const blogService = {
  getAll: (params) => api.get('/blogs', { params }),
  getAllAdmin: (params) => api.get('/blogs/all', { params }),
  getFeatured: () => api.get('/blogs/featured'),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  like: (id) => api.put(`/blogs/${id}/like`),
  getMyBlogs: () => api.get('/blogs/my/blogs'),
};

// Products
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getAllAdmin: (params) => api.get('/products/all', { params }),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/my/products'),
  getCount: () => api.get('/products/count'),
  toggleAvailability: (id) => api.put(`/products/${id}/toggle-availability`),
  toggleFeatured: (id) => api.put(`/products/${id}/toggle-featured`),
};

// Courses
export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  getAllAdmin: (params) => api.get('/courses/all', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  getById: (id) => api.get(`/courses/id/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  togglePublish: (id) => api.put(`/courses/${id}/toggle-publish`),
  toggleFeatured: (id) => api.put(`/courses/${id}/toggle-featured`),
  getCount: () => api.get('/courses/count'),
};

// Mock Tests
export const mockTestService = {
  getAll: (params) => api.get('/mocktests', { params }),
  getAllAdmin: (params) => api.get('/mocktests/all', { params }),
  getFeatured: () => api.get('/mocktests/featured'),
  getBySlug: (slug) => api.get(`/mocktests/${slug}`),
  getById: (id) => api.get(`/mocktests/id/${id}`),
  create: (data) => api.post('/mocktests', data),
  update: (id, data) => api.put(`/mocktests/${id}`, data),
  delete: (id) => api.delete(`/mocktests/${id}`),
  togglePublish: (id) => api.put(`/mocktests/${id}/toggle-publish`),
  toggleFeatured: (id) => api.put(`/mocktests/${id}/toggle-featured`),
  submit: (id, answers) => api.post(`/mocktests/${id}/submit`, { answers }),
  getCount: () => api.get('/mocktests/count'),
};

// Users (Admin only)
export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getPending: () => api.get('/users/pending'),
  getApproved: () => api.get('/users/approved'),
  getStats: () => api.get('/users/stats'),
  approve: (id) => api.put(`/users/${id}/approve`),
  reject: (id, reason) => api.put(`/users/${id}/reject`, { reason }),
  block: (id) => api.put(`/users/${id}/block`),
  unblock: (id) => api.put(`/users/${id}/unblock`),
  changeRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
};
