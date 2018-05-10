module.exports = function (sequelize, DataTypes) {
  const project = sequelize.define('project', {
    p_id: {
      type: DataTypes.INTEGER,
      primarykey: true,
      allowNull: false,
      comment: '프로젝트 id'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '프로젝트명'
    },
    startdate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '시작일',
      domain: '일시'
    },
    duedate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '기한',
      domain: '일시'
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: '완료여부'
    }

  }, {
    tableName: 'project',
    comment: '프로젝트'
  });
  return project;
};
