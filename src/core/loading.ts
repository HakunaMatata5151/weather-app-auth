import { ref, readonly } from 'vue';

import Sleep from './sleep';

const _IS_LOADING_ = ref(false);
export const IsLoading = readonly(_IS_LOADING_);

const _MS_SLEEP_BEFORE_START_ = 500;
const _MS_SLEEP_BEFORE_END_ = 200;

const _LOADERS_ = new Set<Symbol>();

async function _StartLoading() {
    await Sleep(_MS_SLEEP_BEFORE_START_);
    if (_IS_LOADING_.value || _LOADERS_.size == 0) return;

    _IS_LOADING_.value = true;
}

async function _EndLoading() {
    await Sleep(_MS_SLEEP_BEFORE_END_);
    if (!_IS_LOADING_.value || _LOADERS_.size > 0) return;

    _IS_LOADING_.value = false;
}

export default function Loading() {
    const token = Symbol('Loading');
    _LOADERS_.add(token);

    _StartLoading();

    return () => {
        _LOADERS_.delete(token);
        _EndLoading();
    };
}
