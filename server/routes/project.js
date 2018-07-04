
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
router.post('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const create = await models.assign_r.create({
      uid: req.params.uid,
      pid: req.params.pid,
      role: req.body.role
    });
    if (create) {
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
      const create = await models.assign_r.create({
        uid: req.params.uid,
        pid: req.params.pid,
        role: req.body.role
      });
      if (create) {
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
router.put('/:uid/:pid/:tdid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
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
  } else if (req.session.user.auth === 2) {
    const todo = await models.todo.findOne({
      where: {
        tdid: req.params.tdid
      }
    });
    const project = await models.project.findOne({
      where: {
        pid: todo.pid
      }
    });
    if (req.session.user.uid === project.uid) {
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

// todo 제거(PM과 ADMIN만 가능)
router.delete('/:pid/:tdid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.todo.destroy({
      where: { tdid: req.params.tdid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const todo = await models.todo.findOne({
      where: {
        tdid: req.params.tdid
      },
      include: ['project']
    });
    if (todo.project.uid === req.session.user.uid) {
      const destroy = await models.todo.destroy({
        where: { tdid: req.params.tdid }
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


// 본인 소속 프로젝트의 프로젝트 정보와 (본인의 )To Do list 불러옴
router.get('/todo/:uid/:pid', wrap(async (req, res) => {
  const tdids = await models.todo.findAll({
    where: {
      pid: req.params.pid
    }
  });
  let existence = []
  for (let i = 0; i < tdids.length; i++){
    const list1 = await models.list.findAll({
      where: {
        uid: req.params.uid,
        tdid: tdids[i].tdid
      }
    });
    existence.push(list1);
  }
  if (existence[0][0] != null) {
    res.send(tdids)
  } else {
    res.send({
      result: false
    });
  }
}));



// Todo 상세 정보 불러옴(get방식으로)
router.get('/:uid/:pid/:tdid', wrap(async (req, res) => {
  const list = await models.list.findAll({
    where: {
      uid: req.params.uid,
      tdid: req.params.tdid
    },
    include: ['todo']
  });
  res.send(list);
}));

// pid에 해당하는 todo 목록 가져오기
router.get('/pmpid/:pid', wrap(async (req, res) => {
  const todo = await models.todo.findAll({
    where: { pid: req.params.pid }
  });
  if (todo) {
    res.send(todo);
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
  if (req.session.user.auth === 1) {
    const create = await models.todo.create(req.body);
    if (create) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.body.pid
      }
    });
    if (project.uid === req.session.user.uid) {
      const create = await models.todo.create(req.body);
      if (create) {
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

// 본인 소속 프로젝트의 프로젝트 정보와 To Do list 불러옴
router.get('/:uid/:pid', wrap(async (req, res) => {
  const project = await models.assign_r.findAll({
    where: {
      uid: req.params.uid,
      pid: req.params.pid
    },
    include: ['project']
  });
  const todo = await models.todo.findAll({
    where: {
      pid: req.params.pid
    }
  });
  if (project && todo) {
    res.send({ project, todo });
  }
}));







module.exports = router;
