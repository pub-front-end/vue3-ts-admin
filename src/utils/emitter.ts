/**
 * 事件总线。
 * 命名规则：模块.事件
 */
import mitt, { Emitter } from 'mitt';
export const emitter: Emitter = mitt();

// working with handler references:
// function onFoo() {}
// emitter.on('foo', onFoo); // listen
// emitter.off('foo', onFoo); // unlisten
// emitter.emit('foo', onFoo); // unlisten
