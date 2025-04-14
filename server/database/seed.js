const sequelize = require('../config/db');
const { User, Patient, Doctor, Staff, Admin, Permission, RolePermission } = require('../modules/account/models/AccountModel');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    // Seed users
    const users = [
      { email: 'admin1@example.com', username: 'admin1', password: 'admin123', full_name: 'Admin One', gender: 'male', address: 'Hanoi', role: 'admin', department: 'IT' },
      { email: 'staff1@example.com', username: 'staff1', password: 'staff123', full_name: 'Staff One', gender: 'other', address: 'Hanoi', role: 'staff', position: 'receptionist', shift: 'morning', position_description: 'Tiếp nhận bệnh nhân' },
      { email: 'doctor1@example.com', username: 'doctor1', password: 'doctor123', full_name: 'Doctor One', gender: 'female', address: 'Danang', role: 'doctor', specialty: 'Cardiology', license_number: 'LIC001' },
      { email: 'patient1@example.com', username: 'patient1', password: 'patient123', full_name: 'Patient One', gender: 'male', address: 'Danang', role: 'patient', medical_history: 'No issues', blood_type: 'O+' },
    ];
    for (const user of users) {
      let existingUser = await User.findOne({ where: { email: user.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        existingUser = await User.create({
          email: user.email,
          username: user.username,
          password: hashedPassword,
          role: user.role,
          status: 'active',
          full_name: user.full_name,
          gender: user.gender,
          address: user.address,
        });
        if (user.role === 'admin') await Admin.update({ department: user.department }, { where: { user_id: existingUser.id } });
        if (user.role === 'staff') await Staff.update({ position: user.position, shift: user.shift, position_description: user.position_description }, { where: { user_id: existingUser.id } });
        if (user.role === 'doctor') await Doctor.update({ specialty: user.specialty, license_number: user.license_number }, { where: { user_id: existingUser.id } });
        if (user.role === 'patient') await Patient.update({ medical_history: user.medical_history, blood_type: user.blood_type }, { where: { user_id: existingUser.id } });
        console.log(`Đã tạo ${user.role}: ${user.email}`);
      }
    }

    // Seed permissions
    const permissions = [
      // Module: Quản lý tài khoản
      { name: 'view_accounts', description: 'Xem danh sách tài khoản', module: 'manage_accounts' },
      { name: 'edit_accounts', description: 'Sửa thông tin tài khoản', module: 'manage_accounts' },
      { name: 'delete_accounts', description: 'Xóa tài khoản', module: 'manage_accounts' },

      // Module: Quản lý người dùng
      { name: 'view_users', description: 'Xem danh sách người dùng', module: 'manage_users' },
      { name: 'add_users', description: 'Thêm người dùng', module: 'manage_users' },
      { name: 'edit_users', description: 'Sửa thông tin người dùng', module: 'manage_users' },
      { name: 'delete_users', description: 'Xóa người dùng', module: 'manage_users' },
      { name: 'assign_user_roles', description: 'Phân vai trò cho người dùng', module: 'manage_users' },
      
      // Module: Quản lý tư vấn
      { name: 'view_consultations', description: 'Xem lịch sử tư vấn', module: 'manage_consultations' },
      { name: 'conduct_consultations', description: 'Thực hiện tư vấn', module: 'manage_consultations' },
      { name: 'track_consultations', description: 'Theo dõi lịch tư vấn', module: 'manage_consultations' },
      { name: 'schedule_consultations', description: 'Lên lịch tư vấn', module: 'manage_consultations' },

      // Module: Quản lý nội dung
      { name: 'view_content', description: 'Xem bài viết', module: 'manage_content' },
      { name: 'add_content', description: 'Thêm bài viết', module: 'manage_content' },
      { name: 'edit_content', description: 'Sửa bài viết', module: 'manage_content' },
      { name: 'delete_content', description: 'Xóa bài viết', module: 'manage_content' },
      { name: 'moderate_content', description: 'Kiểm duyệt bài viết', module: 'manage_content' },

      // Module: Quản lý thông tin y tế
      { name: 'view_medical_info', description: 'Xem thông tin y tế', module: 'manage_medical_info' },
      { name: 'add_medical_info', description: 'Thêm thông tin y tế', module: 'manage_medical_info' },
      { name: 'edit_medical_info', description: 'Sửa thông tin y tế', module: 'manage_medical_info' },
      { name: 'delete_medical_info', description: 'Xóa thông tin y tế', module: 'manage_medical_info' },
      { name: 'moderate_medical_info', description: 'Kiểm duyệt thông tin y tế', module: 'manage_medical_info' },

      // Module: Quản lý hồ sơ cá nhân điện tử
      { name: 'view_profile', description: 'Xem hồ sơ cá nhân', module: 'manage_profiles' },
      { name: 'edit_profile', description: 'Sửa hồ sơ cá nhân', module: 'manage_profiles' },

      // Module: Quản lý thông báo
      { name: 'view_notifications', description: 'Xem thông báo', module: 'manage_notifications' },
      { name: 'add_notifications', description: 'Thêm thông báo', module: 'manage_notifications' },
      { name: 'edit_notifications', description: 'Sửa thông báo', module: 'manage_notifications' },
      { name: 'delete_notifications', description: 'Xóa thông báo', module: 'manage_notifications' },
      { name: 'schedule_notifications', description: 'Hẹn giờ thông báo', module: 'manage_notifications' },

      // Module: Quản lý diễn đàn
      { name: 'view_forum', description: 'Xem bài viết diễn đàn', module: 'manage_forum' },
      { name: 'post_forum', description: 'Đăng bài trên diễn đàn', module: 'manage_forum' },
      { name: 'edit_forum', description: 'Sửa bài viết diễn đàn', module: 'manage_forum' },
      { name: 'delete_forum', description: 'Xóa bài viết diễn đàn', module: 'manage_forum' },
      { name: 'moderate_forum', description: 'Kiểm duyệt diễn đàn', module: 'manage_forum' },

      // Module: Quản lý nhóm bệnh nhân
      { name: 'view_groups', description: 'Xem nhóm bệnh nhân', module: 'manage_groups' },
      { name: 'join_groups', description: 'Tham gia nhóm bệnh nhân', module: 'manage_groups' },
      { name: 'create_groups', description: 'Tạo nhóm bệnh nhân', module: 'manage_groups' },
      { name: 'manage_groups', description: 'Quản lý nhóm bệnh nhân', module: 'manage_groups' },

      // Module: Quản lý thanh toán
      { name: 'view_payments', description: 'Xem lịch sử thanh toán', module: 'manage_payments' },
      { name: 'process_payments', description: 'Xử lý thanh toán', module: 'manage_payments' },
      { name: 'refund_payments', description: 'Hoàn tiền', module: 'manage_payments' },

      // Module: Thống kê và báo cáo
      { name: 'view_analytics', description: 'Xem thống kê', module: 'manage_analytics' },
      { name: 'generate_reports', description: 'Tạo báo cáo', module: 'manage_analytics' },

      // Module: Quản lý lịch khám
      { name: 'view_schedules', description: 'Xem lịch khám', module: 'manage_schedules' },
      { name: 'add_schedules', description: 'Thêm lịch khám', module: 'manage_schedules' },
      { name: 'edit_schedules', description: 'Sửa lịch khám', module: 'manage_schedules' },
      { name: 'delete_schedules', description: 'Hủy lịch khám', module: 'manage_schedules' },
    ];
    for (const perm of permissions) {
      const existingPerm = await Permission.findOne({ where: { name: perm.name } });
      if (!existingPerm) {
        await Permission.create(perm);
        console.log(`Đã tạo quyền: ${perm.name}`);
      }
    }

    // Seed role permissions
    const rolePermissions = [
      // Quản lý tài khoản
      { role: 'admin', permission_name: 'view_accounts' },
      { role: 'admin', permission_name: 'edit_accounts' },
      { role: 'admin', permission_name: 'delete_accounts' },
      { role: 'staff', permission_name: 'view_accounts' },
      { role: 'staff', permission_name: 'edit_accounts' },
      { role: 'doctor', permission_name: 'view_accounts' },
      { role: 'patient', permission_name: 'view_accounts' },

      // Thêm quyền cho module: Quản lý người dùng
      { role: 'admin', permission_name: 'view_users' },
      { role: 'admin', permission_name: 'add_users' },
      { role: 'admin', permission_name: 'edit_users' },
      { role: 'admin', permission_name: 'delete_users' },
      { role: 'admin', permission_name: 'assign_user_roles' },
      { role: 'staff', permission_name: 'view_users' },
      { role: 'staff', permission_name: 'add_users' },

      // Quản lý tư vấn
      { role: 'admin', permission_name: 'view_consultations' },
      { role: 'admin', permission_name: 'track_consultations' },
      { role: 'staff', permission_name: 'view_consultations' },
      { role: 'staff', permission_name: 'track_consultations' },
      { role: 'doctor', permission_name: 'view_consultations' },
      { role: 'doctor', permission_name: 'conduct_consultations' },
      { role: 'doctor', permission_name: 'track_consultations' },
      { role: 'doctor', permission_name: 'schedule_consultations' },
      { role: 'patient', permission_name: 'view_consultations' },
      { role: 'patient', permission_name: 'conduct_consultations' },
      { role: 'patient', permission_name: 'track_consultations' },
      { role: 'patient', permission_name: 'schedule_consultations' },

      // Quản lý nội dung
      { role: 'admin', permission_name: 'view_content' },
      { role: 'admin', permission_name: 'add_content' },
      { role: 'admin', permission_name: 'edit_content' },
      { role: 'admin', permission_name: 'delete_content' },
      { role: 'admin', permission_name: 'moderate_content' },
      { role: 'staff', permission_name: 'view_content' },
      { role: 'staff', permission_name: 'add_content' },
      { role: 'staff', permission_name: 'edit_content' },
      { role: 'staff', permission_name: 'delete_content' },
      { role: 'doctor', permission_name: 'view_content' },
      { role: 'doctor', permission_name: 'add_content' },
      { role: 'doctor', permission_name: 'edit_content' },
      { role: 'doctor', permission_name: 'delete_content' },
      { role: 'patient', permission_name: 'view_content' },

      // Quản lý thông tin y tế
      { role: 'admin', permission_name: 'view_medical_info' },
      { role: 'admin', permission_name: 'add_medical_info' },
      { role: 'admin', permission_name: 'edit_medical_info' },
      { role: 'admin', permission_name: 'delete_medical_info' },
      { role: 'admin', permission_name: 'moderate_medical_info' },
      { role: 'staff', permission_name: 'view_medical_info' },
      { role: 'staff', permission_name: 'add_medical_info' },
      { role: 'staff', permission_name: 'edit_medical_info' },
      { role: 'staff', permission_name: 'delete_medical_info' },
      { role: 'doctor', permission_name: 'view_medical_info' },
      { role: 'doctor', permission_name: 'add_medical_info' },
      { role: 'doctor', permission_name: 'edit_medical_info' },
      { role: 'doctor', permission_name: 'delete_medical_info' },
      { role: 'patient', permission_name: 'view_medical_info' },

      // Quản lý hồ sơ cá nhân điện tử
      { role: 'admin', permission_name: 'view_profile' },
      { role: 'admin', permission_name: 'edit_profile' },
      { role: 'staff', permission_name: 'view_profile' },
      { role: 'staff', permission_name: 'edit_profile' },
      { role: 'doctor', permission_name: 'view_profile' },
      { role: 'doctor', permission_name: 'edit_profile' },
      { role: 'patient', permission_name: 'view_profile' },
      { role: 'patient', permission_name: 'edit_profile' },

      // Quản lý thông báo
      { role: 'admin', permission_name: 'view_notifications' },
      { role: 'admin', permission_name: 'add_notifications' },
      { role: 'admin', permission_name: 'edit_notifications' },
      { role: 'admin', permission_name: 'delete_notifications' },
      { role: 'admin', permission_name: 'schedule_notifications' },
      { role: 'staff', permission_name: 'view_notifications' },
      { role: 'staff', permission_name: 'add_notifications' },
      { role: 'staff', permission_name: 'edit_notifications' },
      { role: 'staff', permission_name: 'delete_notifications' },
      { role: 'doctor', permission_name: 'view_notifications' },
      { role: 'doctor', permission_name: 'add_notifications' },
      { role: 'doctor', permission_name: 'edit_notifications' },
      { role: 'patient', permission_name: 'view_notifications' },

      // Quản lý diễn đàn
      { role: 'admin', permission_name: 'view_forum' },
      { role: 'admin', permission_name: 'post_forum' },
      { role: 'admin', permission_name: 'edit_forum' },
      { role: 'admin', permission_name: 'delete_forum' },
      { role: 'admin', permission_name: 'moderate_forum' },
      { role: 'staff', permission_name: 'view_forum' },
      { role: 'staff', permission_name: 'post_forum' },
      { role: 'doctor', permission_name: 'view_forum' },
      { role: 'doctor', permission_name: 'post_forum' },
      { role: 'patient', permission_name: 'view_forum' },
      { role: 'patient', permission_name: 'post_forum' },

      // Quản lý nhóm bệnh nhân
      { role: 'admin', permission_name: 'view_groups' },
      { role: 'admin', permission_name: 'manage_groups' },
      { role: 'doctor', permission_name: 'view_groups' },
      { role: 'doctor', permission_name: 'manage_groups' },
      { role: 'patient', permission_name: 'view_groups' },
      { role: 'patient', permission_name: 'join_groups' },
      { role: 'patient', permission_name: 'create_groups' },

      // Quản lý thanh toán
      { role: 'admin', permission_name: 'view_payments' },
      { role: 'admin', permission_name: 'process_payments' },
      { role: 'admin', permission_name: 'refund_payments' },
      { role: 'staff', permission_name: 'view_payments' },
      { role: 'staff', permission_name: 'process_payments' },
      { role: 'patient', permission_name: 'view_payments' },

      // Thống kê và báo cáo
      { role: 'admin', permission_name: 'view_analytics' },
      { role: 'admin', permission_name: 'generate_reports' },
      { role: 'doctor', permission_name: 'view_analytics' },

      // Quản lý lịch khám
      { role: 'admin', permission_name: 'view_schedules' },
      { role: 'admin', permission_name: 'add_schedules' },
      { role: 'admin', permission_name: 'edit_schedules' },
      { role: 'admin', permission_name: 'delete_schedules' },
      { role: 'staff', permission_name: 'view_schedules' },
      { role: 'staff', permission_name: 'add_schedules' },
      { role: 'staff', permission_name: 'edit_schedules' },
      { role: 'doctor', permission_name: 'view_schedules' },
      { role: 'doctor', permission_name: 'add_schedules' },
      { role: 'doctor', permission_name: 'edit_schedules' },
      { role: 'patient', permission_name: 'view_schedules' },
      { role: 'patient', permission_name: 'add_schedules' },
    ];
    for (const rp of rolePermissions) {
      const perm = await Permission.findOne({ where: { name: rp.permission_name } });
      const existingRP = await RolePermission.findOne({ where: { role: rp.role, permission_id: perm.id } });
      if (!existingRP) {
        await RolePermission.create({ role: rp.role, permission_id: perm.id });
        console.log(`Đã gán quyền ${rp.permission_name} cho vai trò ${rp.role}`);
      }
    }

    console.log('Seed dữ liệu thành công');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error.message);
  }
};

module.exports = seedData;