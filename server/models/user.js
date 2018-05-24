module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    uid: {
      type: DataTypes.STRING(20),
      primarykey: true,
      allowNull: false,
      comment: 'id'
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '사용자이름'
    },
    pw: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: '비밀번호'
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: '이메일'
      // /도메인 입력하기
    },
    ph: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '전화번호'
    },
    auth: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      comment: '권한',
      defaultValue: 0,
    }

  }, {
    tableName: 'user',
    comment: '유저'
  });
  return user;
};
