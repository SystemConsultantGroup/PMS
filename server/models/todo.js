module.exports = function(sequelize, DataTypes) {
    var todo = sequelize.define("todo", {
        td_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "아이디"
        },
        component: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "프로젝트 내용"
        },
        duedate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "todo 기한",
            domain: '일시'
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            comment: "완료 여부"
        }
    }, {
        tableName: 'todo',
        comment: "새 테이블"
    });
    todo.associate = function(models){
    todo.belongsTo(models.project, { foreignKey: {name: 'p_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
}
    return todo;
};