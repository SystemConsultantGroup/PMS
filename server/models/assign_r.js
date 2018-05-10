module.exports = function (sequelize, DataTypes) {
  const assign_r = sequelize.define('assign_r', {
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '프로젝트 내 역할'
    }

  }, {
    tableName: 'assign_r',
    comment: '새 테이블 3'
  });
  assign_r.associate = function (models) {
    assign_r.belongsTo(models.user, { foreignKey: { name: 'u_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    assign_r.belongsTo(models.project, { foreignKey: { name: 'p_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return assign_r;
};
