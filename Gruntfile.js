'use strict';

module.exports = function(grunt) {

  // our *in order* IIFE source files
  var iifeFiles =
        [
          './src/js/view.js',
          './src/js/model.js',
          './src/js/controller.js'
         
        ];
  
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\r\n' // separate with a newline
      },
      dev: {
        files: {
          './dev/js/<%= pkg.name %>.js': iifeFiles
        }
      },
      build : {
        files: {
          './build/js/<%= pkg.name %>.js': iifeFiles
        }
      }
    },
    uglify: {
      dist: {
        options: {
          mangle: true
        },
        files: {
          './build/js/<%= pkg.name %>.min.js': ['./build/js/<%= pkg.name %>.js']
        }
      }
    },
    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      },
      all: [
        './src/js/**/*.js'
      ]
    },
    sass: {
      dev: {
        options: {
          style: 'compact'
        },
        files: {
            './dev/css/<%= pkg.name %>.css': './src/scss/<%= pkg.name %>.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
            './build/css/<%= pkg.name %>.min.css': './src/scss/<%= pkg.name %>.scss'
        }
      }
    },
    processhtml: {
      dev: {
        options: {
            process: true,
            data: {
                title: '<%= pkg.description %>'
            }
        },
        files: {
          './dev/index.html': ['./src/html/index.html']
        }
      },
      dist: {
        options: {

            process: true,
            data: {
                title: '<%= pkg.description %>'
            }
        },
        files : {
            './build/index.html': ['./src/html/index.html']
        }
      }
    },
    jasmine: {
      all: {
        src: iifeFiles, 
        options: {
          'vendor': './src/libs/**/*.js',
          'specs': './spec/**/*.js'
        }
      }
    },
    watch: {
      files: ['./Gruntfile.js', './src/js/**/*.js', './src/scss/**/*.scss', './src/html/index.html'],
      tasks: ['jshint', 'concat:dev', 'sass:dev', 'processhtml:dev']
    },
    shell: {
      copylibs: {
        command: function(dir) {
          return 'mkdir ./' + dir + '/libs/ ' + '&& cp ./src/libs/* ./'+ dir + '/libs';
        }
      },
      copyassets: {
        command: function(dir) {
          return 'mkdir ./' + dir + '/assets/ ' + '&& cp ./src/assets/* ./' + dir + '/assets';
        }
      },
       copytizenassets: {
        command: function(dir) {
          return 'cp ./src/tizenspecific/* ./' + dir + '/assets';
        }
      },
      copytizenconfig:{
        command: function(dir) { return  'cp ./src/tizenSpecific/config.xml ./' + dir + '/' }
      },
      compress: {
        command: 'cd ./build && zip -r ../<%= pkg.name %>.zip ./* && cd ..'
      },
      cleanDev: {
        command: 'rm -rf dev'
      },
      cleanBuild: {
        command: 'rm -rf build'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.option('force', true);

  grunt.registerTask ('devtizen', ['shell:cleanDev',
                             'jshint',
                             'concat:dev',
                             'sass:dev',
                             'processhtml:dev',
                             'shell:copylibs:dev',
                             'shell:copyassets:dev',
                             'shell:copytizenassets:dev',
                             'shell:copytizenconfig:dev',
                             'watch']);

  grunt.registerTask('dev', ['shell:cleanDev',
                             'jshint',
                             'concat:dev',
                             'sass:dev',
                             'processhtml:dev',
                             'shell:copylibs:dev',
                             'shell:copyassets:dev',
                             'watch']);

  grunt.registerTask('test', ['jshint', 'jasmine:all']);

  grunt.registerTask('build', ['shell:cleanBuild',
                               'jshint',
                               'concat:build',
                               'sass:dist',
                               'uglify',
                               'processhtml:dist',
                               'shell:copylibs:build',
                               'shell:copyassets:build']);

  grunt.registerTask('package', ['build', 'shell:compress']);
  grunt.registerTask('cleanDev', ['shell:cleanDev']);
  grunt.registerTask('cleanBuild', ['shell:cleanBuild']);
  grunt.registerTask('clean', ['shell:cleanDev', 'shell:cleanBuild']);
  grunt.registerTask('default', ['package']);
};
