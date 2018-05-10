module.exports = function (sequelize, DataTypes) {
  const list = sequelize.define('list', {

  }, {
    tableName: 'list',
    comment: '새 테이블 2'
  });
  list.associate = function (models) {
    list.belongsTo(models.user, { foreignKey: { name: 'u_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    list.belongsTo(models.todo, { foreignKey: { name: 'td_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return list;
};
