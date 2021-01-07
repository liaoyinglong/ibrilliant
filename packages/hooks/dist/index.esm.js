import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useDebugValue } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import isDeepEqual from 'fast-deep-equal/react';

var cacheedBindActionCreators = _.memoize(bindActionCreators);

function createSliceActionHook(slice) {
  var fn = function fn() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSliceActions(slice);
  };

  var res = _defineProperty({}, "use".concat(_.upperFirst(slice.name), "SliceActions"), fn);

  return res;
}
function useSliceActions(slice) {
  var dispatch = useDispatch();
  var actions = useMemo(function () {
    return cacheedBindActionCreators(slice.actions, dispatch);
  }, [dispatch, slice.actions]);

  var res = _defineProperty({}, "".concat(slice.name, "SliceActions"), actions);

  useDebugValue(res);
  return res;
}

function createSliceStateHook(slice) {
  function useSliceStateHookInner(keys) {
    return useSliceState(slice, keys);
  }

  var res = _defineProperty({}, "use".concat(_.upperFirst(slice.name), "SliceState"), useSliceStateHookInner);

  return res;
}
function useSliceState(slice, keys) {
  var selectorState = useSelector(function (state) {
    var sliceState = state[slice.name];

    if (keys === null || keys === void 0 ? void 0 : keys.length) {
      return _.pick(sliceState, keys);
    }

    return sliceState;
  }, (keys === null || keys === void 0 ? void 0 : keys.length) ? isDeepEqual : void 0);
  return selectorState;
}

var createSliceHook = function createSliceHook(slice) {
  return _objectSpread(_objectSpread({}, createSliceActionHook(slice)), createSliceStateHook(slice));
};

export { createSliceActionHook, createSliceHook, createSliceStateHook, useSliceActions, useSliceState };
