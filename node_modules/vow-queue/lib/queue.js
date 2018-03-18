/**
 * @module vow-queue
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 * @version 0.4.3
 * @license
 * Dual licensed under the MIT and GPL licenses:
 *   * http://www.opensource.org/licenses/mit-license.php
 *   * http://www.gnu.org/licenses/gpl.html
 */

(function() {

function getModule(vow, nextTick) {

var extend = function() {
        var res = {};

        for(var i = 0, len = arguments.length; i < len; i++) {
            var obj = arguments[i];
            if(obj) {
                for(var key in obj) {
                    obj.hasOwnProperty(key) && (res[key] = obj[key]);
                }
            }
        }

        return res;
    },

    DEFAULT_QUEUE_PARAMS = {
        weightLimit : 100
    },
    DEFAULT_TASK_PARAMS = {
        weight   : 1,
        priority : 1
    };

/**
 * @class Queue
 * @exports vow-queue
 */

/**
 * @constructor
 * @param {Object} [params]
 * @param {Number} [params.weightLimit=100]
 */
function Queue(params) {
    this._pendingTasks = [];
    this._params = extend(DEFAULT_QUEUE_PARAMS, params);
    this._curWeight = 0;
    this._isRunScheduled = false;
    this._isStopped = true;
    this._processedBuffer = [];
    this._stats = {
        pendingTasksCount    : 0,
        processingTasksCount : 0,
        processedTasksCount  : 0
    };
}

Queue.prototype = /** @lends Queue.prototype */ {
    /**
     * Adds task to queue
     *
     * @param {Function} taskFn
     * @param {Object} [taskParams]
     * @param {Number} [taskParams.weight=1]
     * @param {Number} [taskParams.priority=1]
     * @returns {vow:promise}
     */
    enqueue : function(taskFn, taskParams) {
        var task = this._buildTask(taskFn, taskParams);

        if(task.params.weight > this._params.weightLimit) {
            throw Error('task with weight of ' +
                task.params.weight +
                ' can\'t be performed in queue with limit of ' +
                this._params.weightLimit);
        }

        this._enqueueTask(task);
        this._isStopped || this._scheduleRun();

        task.defer.promise().always(
            function() {
                this._stats.processingTasksCount--;
                this._stats.processedTasksCount++;
            },
            this);

        return task.defer.promise();
    },

    /**
     * Starts processing of queue
     */
    start : function() {
        if(!this._isStopped) {
            return;
        }

        this._isStopped = false;
        var processedBuffer = this._processedBuffer;
        if(processedBuffer.length) {
            this._processedBuffer = [];
            nextTick(function() {
                while(processedBuffer.length) {
                    processedBuffer.shift()();
                }
            });
        }

        this._hasPendingTasks() && this._scheduleRun();
    },

    /**
     * Stops processing of queue
     */
    stop : function() {
        this._isStopped = true;
    },

    /**
     * Checks whether the queue is started
     * @returns {Boolean}
     */
    isStarted : function() {
        return !this._isStopped;
    },

    /**
     * Sets params of queue
     *
     * @param {Object} params
     * @param {Number} [params.weightLimit]
     */
    setParams : function(params) {
        if(typeof params.weightLimit !== 'undefined') {
            this._params.weightLimit = params.weightLimit;
            this._scheduleRun();
        }
    },

    getStats : function() {
        return this._stats;
    },

    _buildTask : function(taskFn, taskParams) {
        return {
            fn     : taskFn,
            params : extend(DEFAULT_TASK_PARAMS, taskParams),
            defer  : vow.defer()
        };
    },

    _enqueueTask : function(task) {
        var pendingTasks = this._pendingTasks,
            i = pendingTasks.length;

        this._stats.pendingTasksCount++;

        while(i) {
            if(pendingTasks[i - 1].params.priority >= task.params.priority) {
                i === pendingTasks.length?
                    pendingTasks.push(task) :
                    pendingTasks.splice(i, 0, task);
                return;
            }
            i--;
        }

        pendingTasks.unshift(task);
    },

    _scheduleRun : function() {
        if(!this._isRunScheduled) {
            this._isRunScheduled = true;
            nextTick(this._run.bind(this));
        }
    },

    _run : function() {
        this._isRunScheduled = false;
        while(this._hasPendingTasks() && this._allowRunTask(this._pendingTasks[0])) {
            this._runTask(this._pendingTasks.shift());
        }
    },

    _hasPendingTasks : function() {
        return !!this._pendingTasks.length;
    },

    _allowRunTask : function(task) {
        return this._curWeight + task.params.weight <= this._params.weightLimit;
    },

    _runTask : function(task) {
        this._curWeight += task.params.weight;

        this._stats.pendingTasksCount--;
        this._stats.processingTasksCount++;

        var taskRes = vow.invoke(task.fn);

        taskRes
            .progress(
                task.defer.notify,
                task.defer)
            .always(
                function() {
                    this._curWeight -= task.params.weight;
                    if(this._isStopped) {
                        this._processedBuffer.push(function() {
                            task.defer.resolve(taskRes);
                        });
                    }
                    else {
                        task.defer.resolve(taskRes);
                        this._scheduleRun();
                    }
                },
                this);
    }
};

return Queue;

}

var nextTick = typeof setImmediate !== 'undefined'?
        setImmediate :
        typeof process === 'object' && process.nextTick?
            process.nextTick :
            function(fn) {
                setTimeout(fn, 0);
            };

if(typeof modules !== 'undefined') {
    /* global modules */
    modules.define('vow-queue', ['vow'], function(provide, vow) {
        provide(getModule(vow, nextTick));
    });
}

if(typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = getModule(require('vow'), nextTick);
}

})();
