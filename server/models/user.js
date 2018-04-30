module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        u_id: {
            type: DataTypes.STRING(20),
            primarykey: true,
            allowNull: false,
            comment: "id"
        },
        name: {
            type: DataTypes.STRING(5),
            allowNull: false,
            comment: "사용자이름"
        },
        pw: {
            type: DataTypes.STRING(40),
            allowNull: false,
            comment: "비밀번호"
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            comment: "이메일"
            ///도메인 입력하기
        },
        ph: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: "전화번호"
        }
       
    }, {
        tableName: 'user',
        comment: "유저"
    }
    );
    return user;
};