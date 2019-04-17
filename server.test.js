const server = require('./server.js')

test('My Name is Matt', () => {
    expect(server.myName).toEqual('Matt')
})

// It should load environment variables
test('Port is 8080', () => {
    expect(server.port).toBe('8080') &&
    expect(server.redirect_url).toBe('http://localhost:' + server.port + '/callback')
})

// It should start an express server

// It should start the express server on port 8080

