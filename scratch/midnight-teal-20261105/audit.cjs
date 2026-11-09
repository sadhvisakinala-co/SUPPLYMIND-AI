const fs=require('fs'),path=require('path'),ts=require('../../frontend/node_modules/typescript');
const root=path.resolve(__dirname,'../../frontend/src'),base=path.join(__dirname,'before/src');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.tsx?$/.test(p))files.push(path.relative(base,p));}}
walk(base);
function collect(file){const s=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(file,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),text=[],literals=[],api=[],events=[];
function visit(n){
 if(ts.isJsxAttribute(n)){
  if(['className','style','aria-label','aria-current','aria-expanded','role'].includes(n.name.text))return;
  if(n.name.text.startsWith('on'))events.push(n.getText(sf));
 }
 if(ts.isJsxText(n)){const v=n.text.replace(/\s+/g,' ').trim();if(v)text.push(v);}
 if(ts.isStringLiteral(n)||ts.isNumericLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))literals.push(n.text);
 if(ts.isCallExpression(n)&&ts.isPropertyAccessExpression(n.expression)&&n.expression.expression.getText(sf)==='api')api.push(n.getText(sf));
 ts.forEachChild(n,visit);
}visit(sf);return{text,literals,api,events};}
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const report=files.map(file=>{const a=collect(path.join(base,file)),b=collect(path.join(root,file));return{file,renderedTextEqual:eq(a.text,b.text),apiCallsEqual:eq(a.api,b.api),eventHandlersEqual:eq(a.events,b.events),...(file.startsWith('app/')&&file!=='app/layout.tsx'?{pageLiteralsEqual:eq(a.literals,b.literals)}:{})};});
fs.writeFileSync(path.join(__dirname,'preservation-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({filesChecked:report.length,differences:report.filter(r=>Object.values(r).includes(false))},null,2));
