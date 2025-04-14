import React, { useEffect, useState } from 'react';
import { FaHospital, FaUserMd, FaHeartbeat, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { GiMedicalPack } from 'react-icons/gi';
import { MdHealthAndSafety, MdOutlineArticle, MdSupportAgent } from 'react-icons/md';


const About = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    values: false,
    team: false,
    history: false,
    contact: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const teamMembers = [
    {
      name: "TS. BS. Nguyễn Minh Hiếu",
      position: "Giám đốc y khoa",
      bio: "Với hơn 15 năm kinh nghiệm trong lĩnh vực nội khoa và quản lý y tế. Tốt nghiệp Đại học Y Hà Nội và có bằng Tiến sĩ Y khoa tại Đại học Paris."
    },
    {
      name: "ThS. Trần Thu Hà",
      position: "Trưởng bộ phận nội dung y khoa",
      bio: "Chuyên gia về truyền thông y tế và giáo dục sức khỏe cộng đồng. 10 năm kinh nghiệm trong lĩnh vực y tế công cộng."
    },
    {
      name: "KS. Phạm Quang Đức",
      position: "Giám đốc công nghệ",
      bio: "Chuyên gia về phát triển hệ thống thông tin y tế và bảo mật dữ liệu. Từng làm việc tại các công ty công nghệ hàng đầu trong và ngoài nước."
    },
    {
      name: "TS. Lê Thị Minh Tâm",
      position: "Trưởng nhóm nghiên cứu",
      bio: "Chuyên gia nghiên cứu về y học dự phòng và dinh dưỡng. Có hơn 20 công trình nghiên cứu được đăng tải trên các tạp chí y khoa quốc tế."
    }
  ];

  const coreValues = [
    {
      title: "Tính chuyên nghiệp",
      description: "Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe chuyên nghiệp, đúng chuẩn y khoa và luôn cập nhật những kiến thức mới nhất."
    },
    {
      title: "Đồng cảm và thấu hiểu",
      description: "Hiểu được nỗi lo lắng và khó khăn của người bệnh, chúng tôi luôn đặt mình vào vị trí của người dùng để cung cấp dịch vụ tốt nhất."
    },
    {
      title: "Sáng tạo và đổi mới",
      description: "Không ngừng cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm người dùng và chất lượng dịch vụ y tế."
    },
    {
      title: "Bảo mật thông tin",
      description: "Cam kết bảo vệ thông tin cá nhân và dữ liệu y tế của người dùng với các tiêu chuẩn bảo mật cao nhất."
    }
  ];

  const historyMilestones = [
    {
      year: "2018",
      title: "Khởi đầu hành trình",
      description: "Hệ thống Hỗ trợ Sức khỏe được thành lập với sứ mệnh đem công nghệ vào chăm sóc sức khỏe."
    },
    {
      year: "2019",
      title: "Phát triển nền tảng",
      description: "Ra mắt phiên bản đầu tiên của ứng dụng di động và website, cung cấp các tính năng cơ bản về quản lý sức khỏe."
    },
    {
      year: "2021",
      title: "Mở rộng đối tác",
      description: "Hợp tác với hơn 50 bệnh viện và phòng khám trên toàn quốc, mở rộng mạng lưới bác sĩ tư vấn."
    },
    {
      year: "2023",
      title: "Nâng cấp công nghệ",
      description: "Tích hợp trí tuệ nhân tạo và big data vào hệ thống để cá nhân hóa trải nghiệm và nâng cao chất lượng tư vấn."
    },
    {
      year: "2025",
      title: "Đổi mới toàn diện",
      description: "Cải tiến hoàn toàn giao diện và bổ sung nhiều tính năng mới, hướng tới trải nghiệm người dùng tốt nhất."
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section id="hero" className={`section banner-section ${isVisible.hero ? 'visible' : ''}`}>
        <div className="slideshow-container">
          <div className="banner-slide active" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://source.unsplash.com/random/1200x400/?healthcare,team)' }}>
            <div className="banner-content">
              <h1>Giới thiệu về Hệ thống Hỗ trợ Sức khỏe</h1>
              <p>Đơn vị tiên phong trong lĩnh vực ứng dụng công nghệ vào chăm sóc sức khỏe tại Việt Nam</p>
              <div className="hero-icons" style={{ fontSize: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', margin: '30px 0' }}>
                <FaHospital />
                <FaUserMd />
                <FaHeartbeat />
                <MdHealthAndSafety />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className={`section intro-section ${isVisible.mission ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <MdHealthAndSafety className="section-icon" />
            <h2>Sứ mệnh của chúng tôi</h2>
            <p>Công nghệ vì một cộng đồng khỏe mạnh hơn</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px', color: '#4A6572' }}>
                Hệ thống Hỗ trợ Sức khỏe ra đời với sứ mệnh cung cấp giải pháp chăm sóc sức khỏe toàn diện, 
                dễ tiếp cận và hiệu quả cho mọi người. Chúng tôi tin rằng việc chăm sóc sức khỏe không chỉ 
                dừng lại ở việc điều trị bệnh mà còn là quá trình đồng hành, tư vấn và hỗ trợ người dùng 
                xây dựng lối sống lành mạnh.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4A6572' }}>
                Với nền tảng công nghệ hiện đại kết hợp với đội ngũ chuyên gia y tế giàu kinh nghiệm, 
                chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, 
                thuận tiện và phù hợp với nhu cầu của từng cá nhân.
              </p>
            </div>
            <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
              <GiMedicalPack style={{ fontSize: '180px', color: '#5D9B9B', opacity: '0.8' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className={`section categories-section ${isVisible.values ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <FaHeartbeat className="section-icon" />
            <h2>Giá trị cốt lõi</h2>
            <p>Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
          </div>
          
          <div className={`categories-grid ${isVisible.values ? 'visible' : ''}`}>
            {coreValues.map((value, index) => (
              <div className="category-card" key={index}>
                <div className="category-content" style={{ padding: '35px 25px' }}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className={`section services-section ${isVisible.history ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <MdOutlineArticle className="section-icon" />
            <h2>Lịch sử phát triển</h2>
            <p>Hành trình xây dựng và phát triển của Hệ thống Hỗ trợ Sức khỏe</p>
          </div>
          
          <div className={`services-grid ${isVisible.history ? 'visible' : ''}`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {historyMilestones.map((milestone, index) => (
              <div className="service-card" key={index}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#5D9B9B' }}>{milestone.year}</h3>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className={`section articles-section ${isVisible.team ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <IoMdPeople className="section-icon" />
            <h2>Đội ngũ chuyên gia</h2>
            <p>Những người đồng hành cùng sứ mệnh của chúng tôi</p>
          </div>
          
          <div className="team-intro" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
            <p style={{ fontSize: '1.1rem', color: '#6D8A96' }}>
              Hệ thống của chúng tôi quy tụ đội ngũ chuyên gia y tế hàng đầu từ nhiều lĩnh vực khác nhau. 
              Tất cả các bác sĩ đều có chứng chỉ hành nghề và nhiều năm kinh nghiệm trong lĩnh vực chuyên môn.
            </p>
          </div>
          
          <div className={`articles-grid ${isVisible.team ? 'visible' : ''}`}>
            {teamMembers.map((member, index) => (
              <div className="article-card" key={index}>
                <div className="article-image" style={{ 
                  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/300x200/?doctor)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <FaUserMd style={{ fontSize: '60px', color: '#FFFFFF' }} />
                </div>
                <div className="article-content">
                  <h3>{member.name}</h3>
                  <div className="article-meta">
                    <span className="article-author">{member.position}</span>
                  </div>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`section stats-section ${isVisible.team ? 'visible' : ''}`}>
        <div className="container">
          <div className={`stats-grid ${isVisible.team ? 'visible' : ''}`}>
            <div className="stat-item">
              <FaUserMd className="stat-icon" />
              <h3>500+</h3>
              <p>Bác sĩ đối tác</p>
            </div>
            <div className="stat-item">
              <FaHospital className="stat-icon" />
              <h3>100+</h3>
              <p>Cơ sở y tế</p>
            </div>
            <div className="stat-item">
              <FaHeartbeat className="stat-icon" />
              <h3>50,000+</h3>
              <p>Người dùng</p>
            </div>
            <div className="stat-item">
              <MdHealthAndSafety className="stat-icon" />
              <h3>10,000+</h3>
              <p>Tư vấn y tế</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`section cta-section ${isVisible.contact ? 'visible' : ''}`}>
        <div className="container">
          <div className={`section-header ${isVisible.contact ? 'visible' : ''}`}>
            <MdSupportAgent className="section-icon" />
            <h2>Liên hệ với chúng tôi</h2>
            <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaPhone style={{ fontSize: '1.4rem', color: '#5D9B9B', marginRight: '15px' }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>Hotline: 1900 xxxx</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaEnvelope style={{ fontSize: '1.4rem', color: '#5D9B9B', marginRight: '15px' }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>Email: support@hethonghotrosuckhoe.vn</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaMapMarkerAlt style={{ fontSize: '1.4rem', color: '#5D9B9B', marginRight: '15px' }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>Địa chỉ: 123 Đường Sức Khỏe, Quận Cầu Giấy, Hà Nội</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MdSupportAgent style={{ fontSize: '1.4rem', color: '#5D9B9B', marginRight: '15px' }} />
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>Hỗ trợ: 24/7</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#1D3557', marginBottom: '20px' }}>Giờ làm việc</h3>
                <p style={{ color: '#6D8A96', marginBottom: '10px' }}>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p style={{ color: '#6D8A96', marginBottom: '10px' }}>Thứ 7: 8:00 - 12:00</p>
                <p style={{ color: '#6D8A96' }}>Chủ nhật: Nghỉ (Vẫn có nhân viên trực hỗ trợ khẩn cấp)</p>
              </div>
            </div>
            
            <div style={{ flex: '1', minWidth: '300px' }}>
              <form style={{ background: '#EAF4F4', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)' }}>
                <h3 style={{ color: '#1D3557', marginBottom: '20px', textAlign: 'center' }}>Gửi tin nhắn cho chúng tôi</h3>
                <div style={{ marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Họ và tên" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 15px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }} 
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 15px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }} 
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 15px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }} 
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <textarea 
                    placeholder="Nội dung tin nhắn" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 15px', 
                      borderRadius: '5px', 
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      minHeight: '150px',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>
                <button type="submit" className="primary-button" style={{ width: '100%' }}>Gửi tin nhắn</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;