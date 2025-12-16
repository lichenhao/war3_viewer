// Fengari-web适配器，将fengari-web的API映射到项目中使用的fengari API
import * as fengari from 'fengari-web';

// 导出与原来fengari相同的接口
export const lua = fengari.lua;
export const lauxlib = fengari.lauxlib;
export const lualib = fengari.lualib;
export const interop = fengari.interop;

// 导出类型
export type { lua_State } from 'fengari-web';

// 从lua中导出常用的常量
export const {
  LUA_ERRRUN,
  LUA_ERRSYNTAX,
  LUA_OK,
  LUA_VERSION_MAJOR,
  LUA_VERSION_MINOR,
  LUA_REGISTRYINDEX,
  lua_Debug,
  lua_getinfo,
  lua_getstack,
  lua_gettop,
  lua_insert,
  lua_pcall,
  lua_pop,
  lua_pushcfunction,
  lua_remove,
  lua_setglobal,
  lua_tojsstring,
  lua_atnativeerror,
  lua_getglobal,
  lua_rawgeti,
  thread_status,
  to_jsstring,
  luastring
} = fengari.lua;

// 从lua中导出常用的函数
export const {
  lua_register,
  lua_pushinteger,
  lua_pushnumber,
  lua_pushstring,
  lua_pushlightuserdata,
  lua_touserdata,
  lua_pushboolean,
  lua_pushnil,
  lua_toboolean,
  lua_tostring,
} = fengari.lua;

// 从lauxlib中导出常用的函数
export const {
  luaL_checknumber,
  luaL_loadstring,
  luaL_newstate,
  luaL_tolstring,
  luaL_loadbuffer,
  luaL_requiref,
  luaL_checkstring,
  luaL_checkinteger,
  luaL_ref,
  luaL_unref
} = fengari.lauxlib;

// 从ldo中导出常用的函数
export const {
  lua_resume,
  lua_yield
} = fengari.lua;

// 从lstate中导出常用的函数
export const {
  lua_newthread
} = fengari.lua;
export const to_luastring = fengari.to_luastring;
