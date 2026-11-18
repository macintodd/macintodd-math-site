import {categories,generate,randomSeed} from './problems.js';
import {escape,math,renderMath} from './ui.js';
const category=document.getElementById('category'),level=document.getElementById('level'),samples=document.getElementById('samples');
category.innerHTML=categories.map((c,i)=>`<option value="${i+1}">${escape(c)}</option>`).join('');
document.getElementById('generate').onclick=()=>{samples.innerHTML=Array.from({length:20},()=>{const q=generate(Number(category.value),Number(level.value),randomSeed(),{multipleChoice:false});return `<article class="panel"><p>${escape(q.promptText)}</p>${q.promptLatex?math(q.promptLatex):''}<pre>${escape(JSON.stringify(q.table||q.graph||{},null,2))}</pre>${q.solutionSteps.map(math).join('')}</article>`;}).join('');renderMath(samples);};
