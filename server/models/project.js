module.exports = function (sequelize, DataTypes) {
  const project = sequelize.define('project', {
    pid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.DATE,
      allowNull: true,
      comment: '완료여부'
    }

  }, {
    tableName: 'project',
    comment: '프로젝트'
  });
  project.associate = function (models) {
    project.belongsTo(models.user, { foreignKey: { name: 'uid', allowNull: true }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return project;
};
