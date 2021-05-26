module.exports = function(app){
    var Sampler = Object.getPrototypeOf(app).Sampler = new app.Component("sampler");
    // Sampler.debug = true;
    Sampler.createdAt      = "2.0.0";
    Sampler.lastUpdate     = "2.0.0";
    Sampler.version        = "1";
    Sampler.factoryExclude = true;
    Sampler.loadingMsg     = (!app.components.includes('tabs')?"This component require the following components to work properly: \n - tabs":null);
    Sampler.requires       = ['tabs'];

    var arrSections = {
        'Sample page' : {'Sample page' : 'samplepage'},
        'texts' : {'default' : 'texts', 'backgrounded' : 'texts_bg', 'bordered' : 'texts_bd'},
        'titles' : {'default' : 'titles', 'backgrounded' : 'titles_bg', 'With separators': 'titles_sep'},
        'buttons' : {'default' : 'buttons', 'colored' : 'buttons_colors', 'extras': 'buttons_extras'},
        'inputs' : {'Type text' : 'inputs','Type text extra' : 'inputs_texts','Other types' : 'inputs_others','backgrounded' : 'inputs_bg'},
        'backgrounds' : {'backgrounded' : 'backgrounds'},
        'borders' : {'default' : 'borders', 'colored' : 'borders_colors'},
    };
    Sampler.prototype.onCreate = function(){
        var sampler = this;

        var nav = '';
        var content = '';
        for(var item in arrSections){
            nav += '<button data-lvl1="'+app.utils.normalize(item)+'" class="btn-sm btn-bg-secondary">'+ app.utils.capitalize(item) +'</button> ';
            content += '<div class="tab block-std">'+getContent(item,arrSections[item])+'</div>'
        }
        sampler.$body = $(require('mustache-loader!html-loader?interpolate!./templates/index.html')({
            nav: nav,
            content: content
        })).addClass('lvl1');

        sampler.$el.html(sampler.$body);
        if (typeof app.updateUrlNavigation != 'undefined') {
            sampler.$body.find('.tabs__nav button').on('click',function(){
                if (sampler.$el.parent('.tab').hasClass('active'))
                    setTimeout(function(){app.updateUrlNavigation(sampler.getNavState());})
            });
        }
    }
    Sampler.prototype.getNavState = function(){
        var sampler = this;
        return {
            framnav: 'sampler',
            lvl1: sampler.$body.find('.tabs__nav button[data-lvl1].active').attr('data-lvl1') || '',
            lvl2: sampler.$body.find('>.tabs__content>.tab.active .tabs__nav button[data-lvl2].active').attr('data-lvl2') || '',
        }
    }

    var getContent = function(section,config){
        var nav = '';
        var content = '';
        for(var item in config){
            nav += '<button data-lvl2="'+app.utils.normalize(section)+'-'+app.utils.normalize(item)+'" class="btn-sm btn-bd-secondary">'+ app.utils.capitalize(item) +'</button> ';
            if (item != 'backgrounded' && item != 'bordered' && item != 'colored' && item != 'backgrounds')
                content += '<div class="tab p-all">'+require('mustache-loader!html-loader?interpolate!./templates/section_'+config[item]+'.html')()+'</div>';
            else{
                content += '<div class="tab p-all">';
                for(var color in app.styles.colors)
                    content += require('mustache-loader!html-loader?interpolate!./templates/section_'+config[item]+'.html')({color: color});
                content += '</div>';
            }
        }
        var html = require('mustache-loader!html-loader?interpolate!./templates/index.html')({
            nav: nav,
            content: content
        });
        html = $(html).addClass('lvl2').get(0).outerHTML;
        return html;
    }

    return Sampler;
}