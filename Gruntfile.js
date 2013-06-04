/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      jsfiles: [
        'www/static/js/q.js',
        'www/static/js/utils.js',
        'www/static/js/EventEmitter.js',
        'www/static/js/hugs/index.js',
        'www/static/js/hugs/controllers/index.js',
        'www/static/js/hugs/controllers/ProductListing.js',
        'www/static/js/hugs/controllers/Checkout.js',
        'www/static/js/hugs/models/index.js',
        'www/static/js/hugs/models/Storage.js',
        'www/static/js/hugs/models/Basket.js',
        'www/static/js/hugs/models/CheckoutDetails.js',
        'www/static/js/hugs/views/index.js',
        'www/static/js/hugs/views/Basket.js',
        'www/static/js/hugs/views/Checkout.js',
        'www/static/js/hugs/views/CheckoutButton.js'
      ]
    },
    concat: {
      options: {
        separator: '\n;\n'
      },
      all: {
        files: {
          'www/static/js/all.js': '<%= meta.jsfiles %>'
        }
      }
    },
    jshint: {
      all: '<%= meta.jsfiles %>',
      options: {
        curly: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true,
        globals: []
      }
    },
    uglify: {
      options: {
        mangle: {
          except: []
        }
      },
      all: {
        files: {
          'www/static/js/all.js': 'www/static/js/all.js'
        }
      }
    },
    sass: {
      dev: {
        options: {
          lineNumbers: true,
          debugInfo: true
        },
        files: {
          'www/static/css/all.css': 'www/static/css/all.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'www/static/css/all.css': 'www/static/css/all.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: '<%= meta.jsfiles %>',
        tasks: ['concat']
      },
      styles: {
        files: 'www/static/css/*.scss',
        tasks: ['sass:dev']
      }
    }
  });

  grunt.registerTask('server', function() {
    require('./index.js');
  });

  grunt.registerTask('buildStatic', function() {
    var done = this.async();
    require('./build-static.js')(done);
  });

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass:dist']);
  grunt.registerTask('dev', ['concat', 'sass:dev', 'server', 'watch']);
  grunt.registerTask('build', ['concat', 'uglify', 'sass:dist', 'server', 'buildStatic']);

};
