const { request } = require('./util')

const err = (repo, message) =>
  Object.assign(new Error(message), { repo })

// Migrate repository to Gogs.
export default opts => repo =>
  request(`${opts.prefix}/api/v1/repos/migrate`, {
    method: 'post',
    json: true,
    form: Object.assign(
      { username: opts.user, password: opts.pass, uid: opts.uid },

      {
        url: repo.url,
        // clone_addr: repo.url, // For next Gogs release.
        repo_name: repo.name,
        desc: repo.desc,
      },

      repo.private && { private: 'on' },

      opts.auth && {
        auth_username: opts.auth.user,
        auth_password: opts.auth.pass,
      },

      opts.mirror && { mirror: 'on' },
      opts.private && { private: 'on' },

      {}
    ),
  })
    .map(response => Object.assign({ repo }, response.body))

    .doto(({ error }) => {
      if (error) throw err(repo, error)
    })

    // For next Gogs release.
    // .doto(({ message }) => {
    //   if (message) throw err(repo, message)
    // })
