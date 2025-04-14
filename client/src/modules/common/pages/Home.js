import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaHospital, FaNotesMedical, FaCalendarCheck, FaBookMedical, FaBell } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlineLocalPharmacy, MdMedicalServices, MdOutlineTipsAndUpdates } from 'react-icons/md';
import { GiMedicines, GiHealthNormal } from 'react-icons/gi';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    intro: false,
    featured: false,
    categories: false,
    tips: false,
    stats: false,
    cta: false
  });
  
  // Observer ref
  const observerRef = useRef(null);
  
  // Banner slides
  const bannerSlides = [
    {
      title: "Chăm sóc sức khỏe toàn diện",
      description: "Đội ngũ y bác sĩ chuyên nghiệp, tận tâm hỗ trợ bạn 24/7",
      image: "https://wcomvn.s3.ap-southeast-1.amazonaws.com/image/2018/05/27062422/banner-mau-do-xanh-NO001-scaled.jpg"
    },
    {
      title: "Tư vấn sức khỏe trực tuyến",
      description: "Tiết kiệm thời gian với các buổi tư vấn từ xa cùng chuyên gia",
      image: "https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-health-free-consultation-board-blue-background-image_160543.jpg"
    },
    {
      title: "Theo dõi sức khỏe thông minh",
      description: "Ứng dụng công nghệ theo dõi và đánh giá sức khỏe mỗi ngày",
      image: "https://png.pngtree.com/thumb_back/fh260/back_our/20190622/ourmid/pngtree-blue-flat-medical-banner-background-image_209609.jpg"
    }
  ];
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bannerSlides.length]);
  
  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSections(prev => ({
              ...prev,
              [sectionId]: true
            }));
            
            // Add visible class to section elements
            const header = entry.target.querySelector('.section-header');
            const content = entry.target.querySelector('.services-grid, .articles-grid, .categories-grid, .tips-container, .stats-grid, .cta-content');
            
            if (header) header.classList.add('visible');
            if (content) content.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Observe all sections
    const sections = document.querySelectorAll('.home-container section');
    sections.forEach(section => {
      if (section.id) {
        observerRef.current.observe(section);
      }
    });
    
    return () => {
      if (observerRef.current) {
        sections.forEach(section => {
          if (section.id) {
            observerRef.current.unobserve(section);
          }
        });
      }
    };
  }, [setVisibleSections]);
  
  // Medical categories
  const medicalCategories = [
    {
      title: "Tim mạch",
      description: "Chẩn đoán và điều trị các bệnh về tim mạch, huyết áp",
      image: "https://source.unsplash.com/random/300x200/?heart"
    },
    {
      title: "Nội tiết",
      description: "Kiểm soát đường huyết, nội tiết tố và các vấn đề chuyển hóa",
      image: "https://source.unsplash.com/random/300x200/?diabetes"
    },
    {
      title: "Tiêu hóa",
      description: "Khám và tư vấn về các vấn đề tiêu hóa, dạ dày",
      image: "https://source.unsplash.com/random/300x200/?digestion"
    },
    {
      title: "Thần kinh",
      description: "Khám và điều trị các bệnh về não, thần kinh",
      image: "https://source.unsplash.com/random/300x200/?brain"
    }
  ];
  
  // Featured articles
  const featuredArticles = [
    {
      title: "Dinh dưỡng cho người cao tuổi",
      excerpt: "Chế độ dinh dưỡng khoa học giúp người cao tuổi duy trì sức khỏe và phòng ngừa bệnh tật...",
      author: "BS. Nguyễn Văn A",
      category: "Dinh dưỡng",
      image: "https://source.unsplash.com/random/300x200/?elderly,nutrition"
    },
    {
      title: "Tập thể dục đúng cách cho dân văn phòng",
      excerpt: "Những bài tập đơn giản giúp dân văn phòng phòng tránh đau mỏi và các bệnh về cơ xương khớp...",
      author: "ThS. Trần Thị B",
      category: "Vận động",
      image: "https://source.unsplash.com/random/300x200/?office,exercise"
    },
    {
      title: "5 dấu hiệu cảnh báo đột quỵ bạn không nên bỏ qua",
      excerpt: "Nhận biết sớm các dấu hiệu đột quỵ giúp cứu sống bản thân và người thân...",
      author: "TS. Phạm Văn C",
      category: "Cấp cứu",
      image: "https://source.unsplash.com/random/300x200/?stroke,emergency"
    }
  ];
  
  // Services
  const services = [
    {
      title: "Tư vấn sức khỏe",
      description: "Đặt lịch tư vấn trực tuyến hoặc trực tiếp với bác sĩ chuyên khoa",
      icon: <FaUserMd className="service-icon" />
    },
    {
      title: "Đặt lịch khám",
      description: "Đặt lịch khám tại các cơ sở y tế đối tác trên toàn quốc",
      icon: <FaCalendarCheck className="service-icon" />
    },
    {
      title: "Hồ sơ y tế",
      description: "Lưu trữ và quản lý hồ sơ y tế điện tử an toàn, bảo mật",
      icon: <FaNotesMedical className="service-icon" />
    },
    {
      title: "Tra cứu thuốc",
      description: "Tra cứu thông tin thuốc, tương tác thuốc và hướng dẫn sử dụng",
      icon: <MdOutlineLocalPharmacy className="service-icon" />
    },
    {
      title: "Thư viện y khoa",
      description: "Kho tài liệu y khoa được biên soạn bởi các chuyên gia hàng đầu",
      icon: <FaBookMedical className="service-icon" />
    },
    {
      title: "Nhắc nhở sức khỏe",
      description: "Nhắc nhở uống thuốc, lịch khám đúng giờ qua thông báo và email",
      icon: <FaBell className="service-icon" />
    }
  ];
  
  // Health tips
  const healthTips = [
    {
      title: "Uống đủ nước mỗi ngày",
      content: "Uống 2-3 lít nước mỗi ngày giúp cơ thể hấp thụ dinh dưỡng tốt hơn và đào thải độc tố.",
      icon: <MdOutlineTipsAndUpdates className="tip-icon" />
    },
    {
      title: "Vận động thường xuyên",
      content: "Duy trì 30 phút vận động mỗi ngày giúp tăng cường sức khỏe tim mạch và hệ miễn dịch.",
      icon: <GiHealthNormal className="tip-icon" />
    },
    {
      title: "Ngủ đủ giấc",
      content: "Ngủ đủ 7-8 tiếng mỗi đêm giúp cơ thể phục hồi và tăng cường sức đề kháng.",
      icon: <MdHealthAndSafety className="tip-icon" />
    },
    {
      title: "Thực phẩm tự nhiên",
      content: "Ưu tiên thực phẩm tươi sống, hạn chế thực phẩm chế biến sẵn và đồ đóng hộp.",
      icon: <GiMedicines className="tip-icon" />
    }
  ];

  return (
    <div className="home-container">
      {/* Banner Section */}
      <section className="banner-section">
        <div className="slideshow-container">
          {bannerSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})` }}
            >
              <div className="banner-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button className="primary-button">Tìm hiểu thêm</button>
              </div>
            </div>
          ))}
          
          <div className="slide-indicators">
            {bannerSlides.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="intro" className="services-section">
        <div className="container">
          <div className="section-header">
            <MdHealthAndSafety className="section-icon-1" />
            <h2>Dịch vụ y tế chuyên nghiệp</h2>
            <p>Các dịch vụ y tế hiện đại, tiện lợi và được cá nhân hóa</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                {service.icon}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Medical Categories Section */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="section-header">
            <MdMedicalServices className="section-icon" />
            <h2>Chuyên khoa y tế</h2>
            <p>Đội ngũ bác sĩ giàu kinh nghiệm từ nhiều chuyên khoa</p>
          </div>
          
          <div className="categories-grid">
            {medicalCategories.map((category, index) => (
              <div className="category-card" key={index}>
                <div className="category-image" style={{ backgroundImage: `url(${category.image})` }}></div>
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <button className="secondary-button">Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Articles Section */}
      <section id="featured" className="articles-section">
        <div className="container">
          <div className="section-header">
            <FaBookMedical className="section-icon" />
            <h2>Bài viết y khoa nổi bật</h2>
            <p>Kiến thức sức khỏe được chọn lọc bởi đội ngũ chuyên gia</p>
          </div>
          
          <div className="articles-grid">
            {featuredArticles.map((article, index) => (
              <div className="article-card" key={index}>
                <div className="article-image" style={{ backgroundImage: `url(${article.image})` }}>
                  <span className="article-category">{article.category}</span>
                </div>
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="article-author">{article.author}</span>
                  </div>
                  <button className="secondary-button">Đọc tiếp</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-more">
            <button className="outline-button">Xem thêm bài viết</button>
          </div>
        </div>
      </section>
      
      {/* Health Tips Section */}
      <section id="tips" className="tips-section">
        <div className="container">
          <div className="section-header">
            <MdOutlineTipsAndUpdates className="section-icon" />
            <h2>Lời khuyên sức khỏe</h2>
            <p>Những lời khuyên thiết thực để cải thiện sức khỏe mỗi ngày</p>
          </div>
          
          <div className="tips-container">
            <div className="tips-row">
              {healthTips.slice(0, 2).map((tip, index) => (
                <div className="tip-card" key={index}>
                  <div className="tip-header">
                    {tip.icon}
                    <h3 className="tip-title">{tip.title}</h3>
                  </div>
                  <div className="tip-content">
                    <p>{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="tips-row">
              {healthTips.slice(2, 4).map((tip, index) => (
                <div className="tip-card" key={index}>
                  <div className="tip-header">
                    {tip.icon}
                    <h3 className="tip-title">{tip.title}</h3>
                  </div>
                  <div className="tip-content">
                    <p>{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      
      
      {/* CTA Section */}
      <section id="cta" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Bắt đầu hành trình sức khỏe của bạn</h2>
            <p>Đăng ký miễn phí ngay hôm nay để trải nghiệm đầy đủ các tính năng</p>
            <div className="cta-buttons">
              <Link to="/register" className="primary-button">Đăng ký ngay</Link>
              <Link to="/about" className="secondary-button">Tìm hiểu thêm</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;