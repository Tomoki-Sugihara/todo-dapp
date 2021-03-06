// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TodoList {
  uint public taskCount = 0;
  uint256[] public taskIds;

  struct Task {
    uint id;
    address userAddress;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    createTask("Check out dappuniversity.com");
  }

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, msg.sender, _content, false);
    taskIds.push(taskCount);
    emit TaskCreated(taskCount, _content, false);
  }

  function getTaskIds() public view returns (uint256[] memory) {
    return taskIds;
  }

  function getTask(uint256 id)
    public
    view
    taskExists(id)
    returns ( Task memory )
  {
    return tasks[id];
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

  function deleteTask(uint id) public taskExists(id) {
    delete tasks[id];

    for (uint256 i = 0; i < taskIds.length; i++) {
      if (taskIds[i] == id) {
        // this update the element to 0
        delete taskIds[i];
      }
    }
  }

  // errorが出る
  // function getAllTasks() public view returns (Task[] memory) {
  //   Task[] memory result;
  //   for (uint i = 0; i < taskIds.length; i++) {
  //     if (taskIds[i] != 0) {
  //       result[i] = tasks[i];
  //     }
  //   }
  //   return result;
  // }

  modifier taskExists(uint256 id) {
    if (tasks[id].id == 0) {
      revert("Revert: task not found");
    }
    _;
  }
}