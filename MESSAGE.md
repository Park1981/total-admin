D:\total-admin\home-work>npm test

> total-admin@1.0.0 test
> cross-env NODE_OPTIONS=--experimental-vm-modules jest

(node:24536) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  backend/server.test.js
  API Server
    √ GET /healthz should return a healthy status (171 ms)
    √ GET /api/employees should return a list of employees from a mocked database (60 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.385 s, estimated 1 s
Ran all test suites.

D:\total-admin\home-work>