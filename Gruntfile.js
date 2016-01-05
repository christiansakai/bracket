module.exports = function(grunt) {
  var appSrc = [
    './public-src/javascripts/app/main.js',
    './public-src/javascripts/app/services/global.js',
    './public-src/javascripts/app/services/invite.js',
    './public-src/javascripts/app/directives/equals.js',
    './public-src/javascripts/app/controllers/ForgotPasswordCtrl.js',
    './public-src/javascripts/app/controllers/ResetPasswordCtrl.js',
    './public-src/javascripts/app/controllers/MyAccountCtrl.js',
    './public-src/javascripts/app/controllers/CreateGroupCtrl.js',
    './public-src/javascripts/app/controllers/GroupInviteCtrl.js',
    './public-src/javascripts/app/controllers/ViewGroupCtrl.js',
    './public-src/javascripts/app/controllers/ViewGroupInviteCtrl.js',
    './public-src/javascripts/app/controllers/GroupManageCtrl.js',
    './public-src/javascripts/app/controllers/headers.js',
    './public-src/javascripts/app/controllers/users.js'
  ];

  var scriptSrc = [
    './public-src/javascripts/app/modules/teamsbysid14.js',
    './public-src/javascripts/app/modules/bracket.js',
    './public-src/javascripts/app/modules/game.js',
    './public-src/javascripts/app/script.js',
  ];

  var libSrc = [
    './public-src/javascripts/lib/underscore-min.js',
    './public-src/javascripts/lib/jquery.min.js',
    './public-src/javascripts/lib/bootstrap.min.js',
    './public-src/javascripts/lib/angular.min.js',
    './public-src/javascripts/lib/ace.js',
    './public-src/javascripts/lib/async.js',
    './public-src/javascripts/lib/guiders.js',
    './public-src/javascripts/lib/jquery.fittext.js',
    './public-src/javascripts/lib/jquery.payment.js',
    './public-src/javascripts/lib/swig.min.js'
  ];

  grunt.initConfig({
    jshint: {
      all: {
        src: [
          './models/**/*.js',
          './modules/**/*.js',
          './routes/**/*.js',
          './public-src/javascripts/app/**/*.js'
        ]
      },

      options: {
        "smarttabs": true,
        "force":true,
        "debug": true,
        "devel": true,
        "undef": false,
        "laxcomma": true,
        "laxbreak": false,
        "jquery": true,
        "loopfunc": true,
        "sub": true,
        "-W065": true,
        "-W084": true,
        "evil": true
      }
    },

    uglify: {
      options: {
          mangle: false
      },
      app: {
        files: {
          './public/javascripts/app.js': appSrc
        }
      },
      script: {
        files: {
          './public/javascripts/script.js': scriptSrc
        }
      },
      libs: {
        files: {
          './public/javascripts/libs.js': libSrc
        }
      }
    },

    concat: {
      app: {
        src: appSrc ,
        dest: './public/javascripts/app.js'
      },
      script: {
        src: scriptSrc,
        dest: './public/javascripts/script.js'
      },
      lib: {
        src: libSrc,
        dest: './public/javascripts/libs.js'
      }
    },

    sass: {
      styles: {
        files: [{
          expand: true,
          cwd: './public-src/stylesheets/stylesheets',
          src: ['**/**.scss'],
          dest: './public/stylesheets',
          ext: '.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          './models/**/*.js',
          './modules/**/*.js',
          './routes/**/*.js',
          './public-src/javascripts/**/*.js'
        ],
        tasks: ['jshint', 'concat'],
        options: {
          nospawn: true
        }
      },
      css: {
        files: [
          './public-src/stylesheets/**/*.scss'
        ],
        tasks: ['sass']
      }
    },

    buildcontrol: {
      options: {
        dir: '.',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      }
    }

  });

  var tasks;

  if (process.env.NODE_ENV === 'development') {
    tasks = ['jshint', 'concat', 'sass', 'watch'];
    grunt.loadNpmTasks('grunt-contrib-sass');
  } else {
    tasks = ['jshint', 'uglify'];
  }

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-build-control');
  grunt.registerTask('heroku:production', tasks);
  grunt.registerTask('default', tasks);
}