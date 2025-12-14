declare module 'fengari-web' {
  // 导出与 fengari 相同的接口
  export const lua: any;
  export const lauxlib: any;
  export const lualib: any;
  export const interop: any;
  
  // 重新导出类型
  export type { lua_State } from 'fengari';
  
  // 导出常用的常量和函数
  export const LUA_ERRRUN: any;
  export const LUA_ERRSYNTAX: any;
  export const LUA_OK: any;
  export const LUA_VERSION_MAJOR: any;
  export const LUA_VERSION_MINOR: any;
  export const LUA_REGISTRYINDEX: any;
  export const lua_Debug: any;
  export const lua_getinfo: any;
  export const lua_getstack: any;
  export const lua_gettop: any;
  export const lua_insert: any;
  export const lua_pcall: any;
  export const lua_pop: any;
  export const lua_pushcfunction: any;
  export const lua_remove: any;
  export const lua_setglobal: any;
  export const lua_tojsstring: any;
  export const lua_atnativeerror: any;
  export const lua_getglobal: any;
  export const lua_rawgeti: any;
  export const thread_status: any;
  export const to_jsstring: any;
  export const to_luastring: any;
  
  export const lua_register: any;
  export const lua_pushinteger: any;
  export const lua_pushnumber: any;
  export const lua_pushstring: any;
  export const lua_pushlightuserdata: any;
  export const lua_touserdata: any;
  export const lua_pushboolean: any;
  export const lua_pushnil: any;
  export const lua_toboolean: any;
  
  export const luaL_checknumber: any;
  export const luaL_loadstring: any;
  export const luaL_newstate: any;
  export const luaL_tolstring: any;
  export const luaL_loadbuffer: any;
  export const luaL_requiref: any;
  export const luaL_checkstring: any;
  export const luaL_checkinteger: any;
  export const luaL_ref: any;
  export const luaL_unref: any;
  
  export const lua_resume: any;
  export const lua_yield: any;
  
  export const lua_newthread: any;
}

