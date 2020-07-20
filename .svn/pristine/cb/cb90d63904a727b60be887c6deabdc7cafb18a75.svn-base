import Home from './views/Home.vue'
let routes = [{
    path: '/',
    component: Home,
    name: 'Home',
    iconCls: 'fa fa-id-card-o', //图标样式class
    redirect: '/login'
  },
  {
    path: '/',
    component: () => import( /* webpackChunkName: "person" */ './views/Home.vue'),
    name: 'Home',
    iconCls: 'fa fa-id-card-o',
    children: [
      {
        path: '/403',
        component: () => import( /* webpackChunkName: "403" */ './components/403.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/file404',
        component: () => import( /* webpackChunkName: "file404" */ './components/file404.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/noshare',
        component: () => import( /* webpackChunkName: "noshare" */ './components/noshare.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/recycle404',
        component: () => import( /* webpackChunkName: "recycle404" */ './components/recycle404.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/collection',
        component: () => import( /* webpackChunkName: "collection" */ './components/collection.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/invalidshare',
        component: () => import( /* webpackChunkName: "invalidshare" */ './components/invalidshare.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/404',
        component: () => import( /* webpackChunkName: "404_one" */ './components/404.vue'),
        name: '',
        hidden: true
      }, {
        path: '/all_file',
        component: () => import( /* webpackChunkName: "all_file" */ './views/all_file3.0.vue'),
        name: '全部文件',
        hidden: false
      },
      {
        path: '/file_img',
        component: () => import( /* webpackChunkName: "file_img" */ './views/file_all/file_img.vue'),
        name: '图片',
        hidden: true
      },
      {
        path: '/file_doc',
        component: () => import( /* webpackChunkName: "file_doc" */ './views/file_all/file_doc.vue'),
        name: '文档',
        hidden: true
      },
      {
        path: '/file_video',
        component: () => import( /* webpackChunkName: "file_doc" */ './views/file_all/file_video.vue'),
        name: '视频',
        hidden: true
      },
      {
        path: '/styemSet',
        component: () => import( /* webpackChunkName: "styemSet" */ './views/styemSet.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/jurisdiction',
        component: () => import( /* webpackChunkName: "jurisdiction" */ './views/jurisdiction.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/foundation_set',
        component: () => import( /* webpackChunkName: "foundation_set" */ './views/foundation_set.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/recycle',
        component: () => import( /* webpackChunkName: "recycle" */ './views/recycle.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/fileshare',
        component: () => import( /* webpackChunkName: "fileshare" */ './views/fileshare.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/usedFiles',
        component: () => import( /* webpackChunkName: "usedFiles" */ './views/file_all/usedFiles.vue'),
        name: '',
        hidden: true
      },
      {
        path: '/matter',
        component: () => import( /* webpackChunkName: "usedFiles" */ './views/helpCenter/matter.vue'),
        name: '',
        hidden: true
      },

    ]
  },
  {
    path: '/',
    component: () => import( /* webpackChunkName: "person" */ './views/Home.vue'),
    name: 'Home',
    iconCls: 'fa fa-id-card-o',
    children: [{
      path: '/file_group',
      component: () => import( /* webpackChunkName: "file_group" */ './views/file_group.vue'),
      name: '文件组',
      hidden: false
    }, {
      path: '/filegroup_detail/:id/:name',
      component: () => import( /* webpackChunkName: "filegroup_detail" */ './views/file_group/filegroup_detail.vue'),
      name: 'filegroup_detail',
      hidden: false
    }]
  },
  {
    path: '/',
    component: () => import( /* webpackChunkName: "person" */ './views/Home.vue'),
    name: 'Home',
    iconCls: 'fa fa-id-card-o',
    children: []
  },
  {
    path: '/',
    component: () => import( /* webpackChunkName: "person" */ './views/Home.vue'),
    name: 'Home',
    iconCls: 'fa fa-id-card-o',
    children: [{
      path: '/person',
      component: () => import( /* webpackChunkName: "person" */ './views/person.vue'),
      name: '个人中心',
      hidden: true
    }]
  },
  {
    path: '/login',
    component: () => import( /* webpackChunkName: "loginlog" */ './views/Login.vue'),
    name: 'login',
    hidden: false
  },
  {
    path: '/forget_password',
    component: () => import( /* webpackChunkName: "forget_password" */ './views/forget_password.vue'),
    name: '',
    hidden: true
  },
  {
    path: '/500',
    component: () => import( /* webpackChunkName: "500_one" */ './components/500.vue'),
    name: '',
    hidden: true
  },

  {
    path: '/404_t',
    component: () => import( /* webpackChunkName: "404_two" */ './components/404_t.vue'),
    name: '',
    hidden: true
  },
  {
    path: '/helpCenter',
    hidden: true,
    name: '',
    component: () => import( /* webpackChunkName: "helpCenter" */ './views/helpCenter.vue'),
  },{
      path: '/link_share',
      component: () => import( /* webpackChunkName: "link_share" */ './views/myshare/link_share.vue'),
      name: '我的分享',
      hidden: false
    }

];

export default routes;
