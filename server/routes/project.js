
const express = require('express');

const router = express.Router();

const models = require('../models');
const wrap = require('express-async-wrap');


// 본인이 project의 pm인 경우 그 프로젝트를 불러온다 
// 문제점 pm이 uid로 찾고있음...
router.get('/pm/:uid', wrap(async (req, res) => {
  if (req.params.uid === req.session.user.uid){
  const pmprojects = await models.project.findAll({
    where: { uid: req.params.uid }
  });
  res.send(pmprojects);
  } else {
    res.send({
      result: false
    });
  }
}));

// 본인 소속 프로젝트 리스트 불러옴 get방식(pm인 경우도 불러온다)
router.get('/:uid', wrap(async (req, res) => {
  if (req.params.uid === req.session.user.uid) {
    const pids = await models.assign_r.findAll({
      where: { uid: req.params.uid },
      attributes: ['pid']
    });
    const projects = [];
    for (let i = 0; i < pids.length; i += 1) {
      const project = await models.project.findAll({
        where: { pid: pids[i].pid },
        include: ['user']
      });
      projects.push(project[0]);
    }
    res.send(projects);
  } else {
    res.send({
      result: false
    });
  }
}));

// 프로젝트 수행원 추가, 역할 부여(PM과 ADMIN만 가능)
// project의 uid의 값을 바꾼다 또한 auth의 값이 도 바꿀 수 있게 하자
// session의 auth가 1이나 2인 경우에만 수정할 수 있게 한다. 
router.post('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1 || req.session.user.auth === 2) {
    const create = await models.assign_r.create({
      uid: req.params.uid,
      pid: req.params.pid,
      role: req.body.role
    });

    // 값 변경하기
    models.user.update({
      auth: req.body.auth
    },
    {
      where: {
        uid: req.params.uid
      }
    });

    if ( create != null ) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// 해당 프로젝트 제거(PM과 ADMIN만 가능)
router.delete('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.project.destroy({
      where: { pid: req.params.pid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.params.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const destroy = await models.project.destroy({
        where: { pid: req.params.pid }
      });
      if (destroy) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// 해당 to do 수정(PM과 ADMIN만 가능)
router.put('/todo/:tdid', wrap(async (req, res) => {
  const update = await models.todo.update(req.body, {
      where: {
        tdid: req.params.tdid
      }
    });
    if (update) {
      res.send({
        result: true
      });
    }
}));

// todo 제거(PM과 ADMIN만 가능)
router.delete('/todo/:pid/:tdid', wrap(async (req, res) => {
 const destroy = await models.todo.destroy({
      where: { tdid: req.params.tdid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
}));
//delete the user of the project
router.delete('/user/:pid/:uid', wrap(async (req, res) => {
 const destroy = await models.assign_r.destroy({
      where: { 
        uid: req.params.uid,
        pid: req.params.pid 
      }
    });
    if (destroy) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
}));
//delete the user of the todo
router.delete('/todo/user/:tdid/:uid', wrap(async (req, res) => {
 const destroy = await models.list.destroy({
      where: { 
        uid: req.params.uid,
        tdid: req.params.tdid 
      }
    });
    if (destroy) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
}));
// 본인 소속 프로젝트의 프로젝트 정보와 (본인의 )To Do list 불러옴
router.get('/todo/:uid/:pid', wrap(async (req, res) => {
  const tdids = await models.todo.findAll({
    where: {
      pid: req.params.pid
    }
  });
  let existence = []
  console.log(existence);

  for (let i = 0; i < tdids.length; i++){
    const list1 = await models.list.findAll({
      where: {
        uid: req.params.uid,
        tdid: tdids[i].tdid
      }
    });
    if (list1[0] != null){
      existence.push(list1[0].tdid);
    }
    console.log(existence);
  }

  if (existence[0] != null) {
    const tdidUser = []
    for (let j = 0; j < existence.length; j++){
      const list2 = await models.todo.findAll({
        where: {
          tdid: existence[j]
        }
      });
      tdidUser.push(list2[0]);
    }
    res.send(tdidUser);
  } else {
    res.send({
      result: false
    });
  }
}));



// Todo 상세 정보 불러옴(get방식으로)
router.get('/todo/:tdid', wrap(async (req, res) => {

  const list = await models.todo.findOne({
    where: {
      tdid: req.params.tdid
    },
  });

  const uids = await models.list.findAll({
    where: {
      tdid: list.tdid
    },
    attributes: ['uid']
  })
  const dic = {};
  await uids.forEach((u) => {
    dic[u.uid] = [];
  })
  const users = await models.user.findAll({
    where: {
      uid: Object.keys(dic)
    }
  })
  res.send({todo : list, userlist : users});
}));

// pid에 해당하는 todo 목록 가져오기
router.get('/pmpid/:pid', wrap(async (req, res) => {
  const todo = await models.todo.findAll({
    where: { pid: req.params.pid }
  });
  if (todo) {
    res.send(todo);
  } else {
    res.send({
      reslut: false
    });
  }
}));

// pm의 uid를 받으면 해당 pid를 알아내고 그 pid에 해당하는 assign_r에서 uid를 모두 출력
router.get('/pmuid/:pid', wrap(async (req, res) => {
  const output = {};
  const projects = await models.assign_r.findAll({
    where: { pid: req.params.pid },
    attributes: ['uid']
  });

  await projects.forEach((project) => {
    output[project.uid] = [];
  });

  const list = await models.user.findAll({
    where: {
      uid: Object.keys(output)
    }
  });

  res.send(list);
}));

// todo 추가
router.post('/todo', wrap(async (req, res) => {
  const create = await models.todo.create(req.body);
    if (create) {
      res.send({
        result: true
      });
  } else {
    res.send({
      result: false
    });
  }
}));
// todo에 user추가
router.post('/todo/:uid/:tdid', wrap(async (req, res) => {
  const create = await models.list.create(req.body);
    if (create) {
      res.send({
        result: true
      });
  } else {
    res.send({
      result: false
    });
  }
}));
// 본인 소속 프로젝트의 프로젝트 정보와 To Do list 불러옴
router.get('/:uid/:pid', wrap(async (req, res) => {
  const project = await models.project.findAll({
    where: {
      pid: req.params.pid
    }
  });
  res.send(project);
}));

router.put('/todo/done/:tdid',wrap(async (req,res) => {
  const update = await models.todo.update(req.body, {
      where: {
        tdid: req.params.tdid
      }
    });
    if (update) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
}));





module.exports = router;
