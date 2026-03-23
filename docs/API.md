# API Documentation

## Movies API

### GET /api/movies

Lấy danh sách phim

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Tên phim",
      "description": "Mô tả",
      "poster": "url",
      "rating": 8.5
    }
  ]
}
```

### GET /api/movies/:id

Lấy chi tiết phim

### POST /api/movies

Tạo phim mới (Admin only)

### PUT /api/movies/:id

Cập nhật phim (Admin only)

### DELETE /api/movies/:id

Xóa phim (Admin only)

## Users API

### POST /api/users/register

Đăng ký tài khoản

### POST /api/users/login

Đăng nhập

### GET /api/users/profile

Lấy thông tin profile (Authenticated)

---

_Tài liệu sẽ được cập nhật khi phát triển_
