module.exports = function (grunt) {
  grunt.initConfig({
    pkgFile: 'package.json',
    simplemocha: {
      options: {
        ui: 'bdd',
        reporter: 'dot'
      },
      unit: {
        src: [
          'test/mocha-globals.js',
          'test/*.spec.js'
        ]
      }
    },
    'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors'
      }
    },
    conventionalChangelog: {
      release: {
        options: {
          changelogOpts: {
            preset: 'angular'
          }
        },
        src: 'CHANGELOG.md'
      }
    },
    conventionalGithubReleaser: {
      release: {
        options: {
          auth: {
            type: 'oauth',
            token: process.env.GH_TOKEN
          },
          changelogOpts: {
            preset: 'angular',
            releaseCount: 0
          }
        }
      }
    },
    bump: {
      options: {
        commitMessage: 'chore: release v%VERSION%',
        pushTo: 'upstream',
        commitFiles: [
          'package.json',
          'CHANGELOG.md'
        ]
      }
    },
    karma: {
      options: {
        singleRun: true
      },
      simple: {
        configFile: 'examples/simple/karma.conf.js'
      }
    }
  })

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('test', ['simplemocha'])
  grunt.registerTask('default', ['test'])

  grunt.registerTask('release', 'Bump the version and publish to NPM.', function (type) {
    grunt.task.run([
      'npm-contributors',
      'bump:' + (type || 'patch') + ':bump-only',
      'conventionalChangelog',
      'bump-commit',
      'conventionalGithubReleaser',
      'npm-publish'
    ])
  })
}
