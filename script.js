/* Add to js/app.js */


const timelineData = [
{id:1,title:'Chegada à cidade',thumb:'assets/images/timeline1.jpg',text:'O protagonista desperta em uma cidade tomada por marionetes e mentiras. Investigações começam e segredos antigos vêm à tona.'},
{id:2,title:'A Forja das Marionetes',thumb:'assets/images/timeline2.jpg',text:'Uma oficina antiga revela como as criaturas foram animadas — um ponto chave para entender a corrupção crescente.'},
{id:3,title:'Confronto no Teatro',thumb:'assets/images/timeline3.jpg',text:'Eventos culminantes levam ao confronto com chefes que guardam fragmentos de memória sobre a verdade.'},
{id:4,title:'A Revelação',thumb:'assets/images/timeline4.jpg',text:'Segredos sobre a origem dos autômatos e da própria cidade mudam o destino dos personagens.'}
];


const galleryData = {
weapons: [
{id:'w1',name:'Lâmina Enferrujada',img:'assets/images/weapon1.jpg',type:'Cortante',curiosity:'Antiga lâmina usada por guardas','desc':'Uma lâmina simples mas eficiente, com história de batalha.'},
{id:'w2',name:'Machado Reluzente',img:'assets/images/weapon2.jpg',type:'Impacto',curiosity:'Forjado com metais incomuns','desc':'Machado pesado que quebra defesas.'}
],
enemies: [
{id:'e1',name:'Marionete Errante',img:'assets/images/enemy1.jpg',type:'Humanoide',curiosity:'Movimentos imprevisíveis','desc':'Criatura animada por cordas e engrenagens.'},
{id:'e2',name:'Guardião do Teatro',img:'assets/images/enemy2.jpg',type:'Chefe',curiosity:'Protege memórias perdidas','desc':'Um guardião colossal com ataques teatrais.'}
]
};


// Render timeline
const timelineList = document.getElementById('timelineList');
function renderTimeline(){
timelineList.innerHTML = '';
timelineData.forEach(ev =>{
const item = document.createElement('article');
item.className = 'timeline-item shimmer';
item.innerHTML = `
<div class="timeline-thumb"><img src="${ev.thumb}" alt="${ev.title}"></div>
<div class="timeline-meta">
<h4>${ev.title}</h4>
<p>${ev.text}</p>
</div>
`;
timelineList.appendChild(item);
});
}
renderTimeline();


// Reveal on scroll & add metallic sheen animation when visible
const observer = new IntersectionObserver(entries=>{
entries.forEach(ent=>{
if(ent.isIntersecting){
ent.target.classList.add('visible');
// replay shimmer
const shimmer = ent.target.querySelector('.shimmer') || ent.target;
shimmer.classList.remove('shimmer');
void shimmer.offsetWidth;
setTimeout(()=>{document.querySelectorAll('.timeline-item').forEach(n=>observer.observe(n));},30