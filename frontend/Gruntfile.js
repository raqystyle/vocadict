module.exports = function (grunt) {
  "use strict";
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  // Project configuration.
  grunt.initConfig({

    copy: {
      main: {
        files: [
          {
            src: ['components/requirejs/require.js'],
            dest: 'staging/libs/require.js',
            filter: 'isFile'
          }, {
            src: ['components/text/text.js'],
            dest: 'staging/libs/text.js',
            filter: 'isFile'
          }, {
            src: ['components/backbone/backbone.js'],
            dest: 'staging/libs/backbone.js',
            filter: 'isFile'
          }, {
            src: ['components/jquery/jquery.js'],
            dest: 'staging/libs/jquery.js',
            filter: 'isFile'
          }, {
            src: ['components/underscore/underscore.js'],
            dest: 'staging/libs/underscore.js',
            filter: 'isFile'
          }, {
            src: ['components/requirejs/require.js'],
            dest: '../app/vendor/require.js',
            filter: 'isFile'
          }, {
            src: ['components/soundmanager/script/soundmanager2-nodebug-jsmin.js'],
            dest: 'staging/libs/soundmanager.js',
            filter: 'isFile'
          }, {
            src: ['components/normalize-css/normalize.css'],
            dest: '../app/vendor/cssframework/vendor/normalize.css'
          }, {
            src: ['components/cssframework/css/full.css'],
            dest: '../app/vendor/cssframework/full.css'
          }, {
            src: ['components/font-awesome/css/font-awesome.min.css'],
            dest: '../app/vendor/cssframework/vendor/Font-Awesome/css/font-awesome.css'
          }, {
            expand: true,
            cwd: 'components/font-awesome/font/',
            src: ['*'],
            dest: '../app/vendor/fonts/',
            filter: 'isFile'
          }, {
            src: ['components/soundmanager/swf/soundmanager2.swf'],
            dest: '../app/vendor/soundmanager/soundmanager2.swf'
          }, {
            src: ['assets/lastfmsmall.png'],
            dest: '../app/assets/lastfmsmall.png'
          }
        ]
      }
    },

    watch: {
      templates: {
        files: ['src/jade/**/*.jade'],
        tasks: ['jade']
      },
      style: {
        files: ['src/stylus/**/*.styl'],
        tasks: ['stylus:dev']
      },
      scripts: {
        files: ['src/coffee/**/*.coffee'],
        tasks: ['coffee', 'requirejs:dev']
      }
    },

    exec: {
      clone_cssframework: {
        command: 'if [ ! -d "components/cssframework" ]; then cd components/ && git clone https://github.com/raqystyle/cssframework.git; fi'
      },
      turn_off_debug: {
        command: 'sed -i "s/debug\: true\,/debug\: false\,/" staging/app.js',
        stdout: false
      }
    },

    stylus: {
      dev: {
        options: {
          compress: false
        },
        files: {
          '../app/dev/app.css': ['src/stylus/app.styl']
        }
      },
      prod: {
        files: {
          'temp/app.css': ['src/stylus/app.styl']
        }
      }
    },

    cssmin: {
      prod: {
        files: {
          "../app/app.css": ["temp/app.css"]
        }
      }
    },

    jade: {
      compile: {
        options: {
          comileDebug: true,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/jade',
            src: ['**/*.jade'],
            dest: 'staging/templates',
            ext: '.html'
          }
        ]
      }
    },

    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: [
          {
            dest: 'staging/config.js',
            src: 'src/coffee/config.coffee'
          },
          {
            dest: 'staging/app.js',
            src: [
              'src/coffee/appLogic.coffee',
              'src/coffee/app.coffee',
              'src/coffee/**/*.coffee',
              '!src/coffee/config.coffee'
            ]
          }
        ]
      }
    },

    requirejs: {
      options: {
        inlineText: true,
        findNestedDependencies: true,
        name: 'app',
        baseUrl: "./staging",
        mainConfigFile: "staging/config.js"
      },
      dev: {
        options: {
          optimize: "none",
          out: "../app/dev/app.js"
        }
      },
      prod: {
        options: {
          optimize: "uglify",
          out: "temp/app.js"
        }
      }
    },

    uglify: {
      prod: {
        files: {
          '../app/app.js': ['temp/app.js']
        }
      }
    },

    clean: {
      dev: ["temp"],
      prod: ["temp", "staging"]
    }
  });

  grunt.registerTask('build-dev', [
    'copy',
    'stylus:dev',
    'jade',
    'coffee',
    'requirejs:dev',
    'clean:dev'
  ]);
  grunt.registerTask('build-prod', [
    'exec:clone_cssframework',
    'copy',
    'stylus:prod',
    'cssmin',
    'jade',
    'coffee',
    'exec:turn_off_debug',
    'requirejs:prod',
    'uglify',
    'clean:prod'
  ]);
};