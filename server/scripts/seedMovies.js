const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Movie = require('../src/models/Movie');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleMovies = [
  // ===== PHIM LẺ =====
  {
    title: 'Inception',
    description: 'Một tên trộm chuyên xâm nhập vào tiềm thức người khác để đánh cắp bí mật được trao nhiệm vụ trồng một ý tưởng vào đầu CEO của một tập đoàn lớn.',
    release_year: 2010,
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 148,
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Tâm lý'],
    type: 'phim-le'
  },
  {
    title: 'Interstellar',
    description: 'Khi Trái Đất đang hấp hối, một nhóm phi hành gia dũng cảm đã vượt qua lỗ sâu đục không gian để tìm kiếm ngôi nhà mới cho nhân loại trong dải ngân hà.',
    release_year: 2014,
    poster_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 169,
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Kịch tính'],
    type: 'phim-le'
  },
  {
    title: 'The Dark Knight',
    description: 'Batman đối mặt với kẻ thù nguy hiểm nhất đời - tên hề tội phạm Joker, người chỉ muốn xem thế giới bốc cháy và dìm Gotham vào hỗn loạn.',
    release_year: 2008,
    poster_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 152,
    genres: ['Hành động', 'Tội phạm', 'Kịch tính'],
    type: 'phim-le'
  },
  {
    title: 'Blade Runner 2049',
    description: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos.',
    release_year: 2017,
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 164,
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Bí ẩn'],
    type: 'phim-le'
  },
  {
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully sống cùng gia đình Na\'vi mới của mình. Khi rắc rối ùa đến, họ phải lìa bỏ ngôi nhà và khám phá vùng đất xa xôi của Pandora.',
    release_year: 2022,
    poster_url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 192,
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Hành động'],
    type: 'phim-le'
  },
  {
    title: 'Mad Max: Fury Road',
    description: 'Trong thế giới hậu tận thế, Max Rockatansky hợp tác cùng Imperator Furiosa đấu tranh giải thoát cho những nô lệ khỏi bàn tay của bạo chúa Immortan Joe.',
    release_year: 2015,
    poster_url: 'https://images.unsplash.com/photo-1605808365893-90d5bd9daee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: 120,
    genres: ['Hành động', 'Phiêu lưu', 'Hậu tận thế'],
    type: 'phim-le'
  },
  {
    title: 'The Matrix',
    description: 'Hacker Thomas Anderson phát hiện ra sự thật rằng toàn bộ cuộc sống của con người chỉ là một chương trình mô phỏng máy tính do các cỗ máy thông minh tạo ra.',
    release_year: 1999,
    poster_url: 'https://images.unsplash.com/photo-1579562542562-b912faef57e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 136,
    genres: ['Khoa học viễn tưởng', 'Hành động'],
    type: 'phim-le'
  },
  {
    title: 'John Wick: Chapter 4',
    description: 'John Wick tìm kiếm con đường để thoát khỏi Luật Hội, và để làm được điều đó, anh phải đối mặt với kẻ thù mới tàn nhẫn đang kiểm soát những vùng lãnh thổ quan trọng.',
    release_year: 2023,
    poster_url: 'https://images.unsplash.com/photo-1596727147705-611529ef8a1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: 169,
    genres: ['Hành động', 'Tội phạm', 'Kinh dị'],
    type: 'phim-le'
  },
  {
    title: 'Gladiator',
    description: 'Maximus, một vị tướng La Mã tài ba bị phản bội và gia đình bị sát hại, phải lội ngược dòng từ nô lệ trở thành đấu sĩ vĩ đại nhất để báo thù.',
    release_year: 2000,
    poster_url: 'https://images.unsplash.com/photo-1602933069350-10f8a8ad3cc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 155,
    genres: ['Hành động', 'Kịch tính', 'Lịch sử'],
    type: 'phim-le'
  },
  {
    title: 'Oppenheimer',
    description: 'Câu chuyện về J. Robert Oppenheimer - cha đẻ của bom nguyên tử - người đã lãnh đạo Dự án Manhattan để phát triển vũ khí hủy diệt hàng loạt trong Thế chiến thứ hai.',
    release_year: 2023,
    poster_url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    duration: 180,
    genres: ['Tiểu sử', 'Kịch tính', 'Lịch sử'],
    type: 'phim-le'
  },
  {
    title: 'Parasite',
    description: 'Câu chuyện về gia đình nghèo khó Kims từng bước len lỏi vào cuộc sống xa hoa của gia đình giàu có Parks theo những cách đầy bất ngờ và kịch tính.',
    release_year: 2019,
    poster_url: 'https://images.unsplash.com/photo-1560109947-543149eceb16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: 132,
    genres: ['Tội phạm', 'Kịch tính', 'Hài hước đen'],
    type: 'phim-le'
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides hợp nhất với người Fremen trong khi theo đuổi con đường trả thù chống lại những kẻ đã hủy diệt gia đình anh.',
    release_year: 2024,
    poster_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    duration: 166,
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Hành động'],
    type: 'phim-le'
  },

  // ===== PHIM BỘ =====
  {
    title: 'Breaking Bad',
    description: 'Walter White, một giáo viên hóa học mắc bệnh ung thư phổi, bắt đầu sản xuất ma túy đá cùng cựu học trò Jesse Pinkman để đảm bảo tài chính cho gia đình trước khi qua đời.',
    release_year: 2008,
    poster_url: 'https://images.unsplash.com/photo-1603145733146-ae562a55031e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 47,
    genres: ['Tội phạm', 'Kịch tính', 'Tâm lý'],
    type: 'phim-bo'
  },
  {
    title: 'Game of Thrones',
    description: 'Các gia tộc quyền lực tranh giành ngai vàng của Bảy Vương Quốc, trong khi mối hiểm họa huyền bí từ phương Bắc đang dần đe dọa toàn bộ thế giới sống.',
    release_year: 2011,
    poster_url: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 57,
    genres: ['Hành động', 'Phiêu lưu', 'Kịch tính'],
    type: 'phim-bo'
  },
  {
    title: 'Money Heist',
    description: 'Một thiên tài tội phạm tập hợp nhóm cướp đặc biệt tấn công Nhà Đúc Tiền Tây Ban Nha với kế hoạch táo bạo nhất lịch sử - in tiền mà không lấy gì của ai.',
    release_year: 2017,
    poster_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 45,
    genres: ['Tội phạm', 'Hành động', 'Kịch tính'],
    type: 'phim-bo'
  },
  {
    title: 'Stranger Things',
    description: 'Khi một cậu bé mất tích bí ẩn, cả một thị trấn nhỏ phải đối mặt với những thế lực siêu nhiên đáng sợ từ một chiều không gian song song tối tăm gọi là Upside Down.',
    release_year: 2016,
    poster_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 51,
    genres: ['Khoa học viễn tưởng', 'Kinh dị', 'Bí ẩn'],
    type: 'phim-bo'
  },
  {
    title: 'The Witcher',
    description: 'Geralt of Rivia, một thợ săn quái vật đơn độc, vật lộn để tìm chỗ đứng trong một thế giới mà con người thường tàn ác hơn cả những sinh vật hắn được thuê để tiêu diệt.',
    release_year: 2019,
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 60,
    genres: ['Hành động', 'Phiêu lưu', 'Huyền bí'],
    type: 'phim-bo'
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa toàn bộ phim cũ
    await Movie.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');

    // Thêm phim mới
    const movies = await Movie.insertMany(sampleMovies);
    console.log(`🎬 Đã thêm thành công ${movies.length} bộ phim vào MongoDB`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Lỗi seeder: ${error.message}`);
    process.exit(1);
  }
};

seedData();
