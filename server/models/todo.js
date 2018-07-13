module.exports = (sequelize, DataTypes) => {
  const todo = sequelize.define('todo', {
    tdid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      comment: '아이디'
    },
    component: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '프로젝트 내용'
    },
    duedate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'todo 기한',
      domain: '일시'
    },
    done: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '완료 여부'
    }
  }, {
    tableName: 'todo',
    comment: '새 테이블'
  });
  todo.associate = (models) => {
    todo.belongsTo(models.project, { foreignKey: { name: 'pid', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return todo;
};
