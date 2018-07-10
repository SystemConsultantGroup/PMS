module.exports = (sequelize) => {
  const list = sequelize.define('list', {},
    {
      tableName: 'list',
      comment: '새 테이블 2'
    });
  list.associate = (models) => {
    list.belongsTo(models.user, { foreignKey: { name: 'uid', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    list.belongsTo(models.todo, { foreignKey: { name: 'tdid', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return list;
};
