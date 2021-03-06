// Drag animation
Vue.component('draggable-header-view', {
    template: '#header-view-template',
    data: function() {
        return {
            dragging: false,
            // quadratic bezier control point
            c: {
                x: 160,
                y: 160
            },
            // record drag start point
            start: {
                x: 0,
                y: 0
            }
        }
    },
    computed: {
        headerPath: function() {
            return 'M0,0 L2000,0 2000,160' +
                'Q' + this.c.x + ',' + this.c.y +
                ' 0,160'
        },
        contentPosition: function() {
            var dy = this.c.y - 160
            var dampen = dy > 0 ? 2 : 4
            return {
                transform: 'translate3d(0,' + dy / dampen + 'px,0)'
            }
        }
    },
    methods: {
        startDrag: function(e) {
            e = e.changedTouches ? e.changedTouches[0] : e
            this.dragging = true
            this.start.x = e.pageX
            this.start.y = e.pageY
        },
        onDrag: function(e) {
            e = e.changedTouches ? e.changedTouches[0] : e
            if (this.dragging) {
                this.c.x = 160 + (e.pageX - this.start.x)
                    // dampen vertical drag by a factor
                var dy = e.pageY - this.start.y
                var dampen = dy > 0 ? 1.5 : 4
                this.c.y = 160 + dy / dampen
            }
        },
        stopDrag: function() {
            if (this.dragging) {
                this.dragging = false
                dynamics.animate(this.c, {
                    x: 160,
                    y: 160
                }, {
                    type: dynamics.spring,
                    duration: 700,
                    friction: 280
                })
            }
        }
    }
})

// Pokemon component

// register the grid component
Vue.component('demo-grid', {

    template: '#grid-template', //allows <script type="text/x-template" id="grid-template"> in html to be used for template direction
    replace: true, //wraps the template and allows it to work
    props: { //passing data from parent componenets
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function() {
        var sortOrders = {}
        this.columns.forEach(function(key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function() {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function(row) {
                    return Object.keys(row).some(function(key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function(a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})

/**
 * Created by ClarkYin on 2016-11-02.
 */
// The raw data to observe
var stats = [{
    label: 'HP',
    value: 100,
    color: "background-color: #42b983"
}, {
    label: 'ATK',
    value: 100,
    color: "background-color: #42b983"
}, {
    label: 'DEF',
    value: 100,
    color: "background-color: #42b983"
}, {
    label: 'SP.ATK',
    value: 100,
    color: "background-color: #42b983"
}, {
    label: 'SP.DEF',
    value: 100,
    color: "background-color: #42b983"
}, {
    label: 'SPEED',
    value: 100,
    color: "background-color: #42b983"
}]

// A resusable polygon graph component
Vue.component('polygraph', {
    props: ['stats'],
    template: '#polygraph-template',
    computed: {
        // a computed property for the polygon's points
        points: function() {
            var total = this.stats.length
            return this.stats.map(function(stat, i) {
                var point = valueToPoint(stat.value, i, total)
                return point.x + ',' + point.y
            }).join(' ')
        }

    },
    components: {
        // a sub component for the labels
        'axis-label': {
            props: {
                stat: Object,
                index: Number,
                total: Number
            },
            template: '#axis-label-template',
            computed: {
                point: function() {
                    return valueToPoint(+this.stat.value + 10,
                        this.index,
                        this.total
                    )
                }
            }
        }
    }
})

// math helper...
function valueToPoint(value, index, total) {
    var x = 0
    var y = -value * 0.8
    var angle = Math.PI * 2 / total * index
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    var tx = x * cos - y * sin + 100
    var ty = x * sin + y * cos + 100
    return {
        x: tx,
        y: ty
    }
}

Vue.component('labeledprogress', {
    props: ['label'],
    template: '#labledProgress-template'
});

Vue.component('poke-button', {
    props: ['name', 'color'],
    template: '#poke-button-template',
    methods: {
        select: function() {
          this.$emit('click')
        }
    }
});

// bootstrap the app
var pokeapp = new Vue({
    el: '#app',
    data: {
        gridColumns: ['name', 'type', 'hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'],
        pokemons: [{
            name: 'Bulbasaur',
            type: "Grass \\ Poison",
            hp: "45",
            attack: "49",
            defense: "49",
            spAtk: "65",
            spDef: "65",
            speed: "45",
            pic: "./pictures/bulbasaur.png",
            color: "fill: green; background-color: green"

        }, {
            name: 'Charmander',
            type: "Fire",
            hp: "39",
            attack: "52",
            defense: "43",
            spAtk: "60",
            spDef: "50",
            speed: "65",
            pic: "./pictures/charmander.png",
            color: "fill:orange; background-color: orange"
        }, {
            name: 'Squirtle',
            type: "Water",
            hp: "44",
            attack: "48",
            defense: "65",
            spAtk: "50",
            spDef: "64",
            speed: "43",
            pic: "./pictures/squirtle.png",
            color: "fill:lightblue; background-color: lightblue"

        }, {
            name: 'Pikachu',
            type: "Electric",
            hp: "35",
            attack: "55",
            defense: "40",
            spAtk: "55",
            spDef: "55",
            speed: "90",
            pic: "./pictures/pikachu.png",
            color: "fill:gold; background-color: gold"
        }],
        newLabel: '',
        stats: stats,
        image: ''

    },

    methods: {
        selectPokemon: function(pokemon) {
            image = pokemon.pic;

            stats[0].value = pokemon.hp;
            stats[0].color = pokemon.color;

            stats[1].value = pokemon.attack;
            stats[1].color = pokemon.color;

            stats[2].value = pokemon.defense;
            stats[2].color = pokemon.color;

            stats[3].value = pokemon.spAtk;
            stats[3].color = pokemon.color;

            stats[4].value = pokemon.spDef;
            stats[4].color = pokemon.color;

            stats[5].value = pokemon.speed;
            stats[5].color = pokemon.color;

        }
    }
});


// new Vue({ el: '#app' })
