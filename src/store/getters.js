const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  menuList: state => state.user.menuList,
  userSole:state=>state.user.userSole,
  exam:state=>state.user.exam
}
export default getters
