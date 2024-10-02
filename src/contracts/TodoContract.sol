// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;


contract TodoContract {
  struct Task {
    bool _isTask;
    string name;
    string status;
    uint256 startAt;
    uint256 endAt;
  }

  Task[] private _tasks;

  function taskFindById(uint id) public view returns (Task memory) {
    require(_tasks.length >= id, "Id out of range");

    return _tasks[id];
  }

  function taskFindAll() public view returns (Task[] memory) {
    return _tasks;
  }

  function taskCreate(
    string memory _name,
    string memory _status,
    uint256 _startAt,
    uint256 _endAt
  ) public returns (Task memory) {
    Task memory task = Task(
      true,
      _name,
      _status,
      _startAt,
      _endAt
    );

    _tasks.push(task);

    return task;
  }

  function taskUpdate(
    uint256 id,
    string memory _name,
    string memory _status,
    uint256 _startAt,
    uint256 _endAt
  ) public returns (Task memory)  {
    Task storage task = _tasks[id];

    task.name = _name;
    task.startAt = _startAt;
    task.status = _status;
    task.endAt = _endAt;

    return task;
  }
}
