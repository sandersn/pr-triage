/** @type {[string, number][]} */
const contrib = [
  ["a-tarasyuk", 75],
  ["Andarist", 79],
  ["Josh-Cena", 1],
  ["apendua", 3],
  ["simllll", 1],
  ["fishcharlie", 1],
  ["jonathanKingston", 1],
  ["jasonlyu123", 3],
  ["Eyal-Shalev", 1],
  ["JoshuaKGoldberg", 5],
  ["gmanninglive", 1],
  ["swandir", 1],
  ["ericbf", 2],
  ["abuob", 1],
  ["zardoy", 10],
  ["ronyhe", 1],
  ["shicks", 1],
  ["m-basov", 1],
  ["jadestrong", 1],
  ["Tobias-Scholz", 4],
  ["OliverRadini", 1],
  ["jespertheend", 1],
  ["sroucheray", 1],
  ["matiasosorio1999", 1],
  ["joaosantos99", 1],
  ["pyBlob", 1],
  ["ExE-Boss", 1],
  ["pnacht", 2],
  ["graphemecluster", 3],
  ["brendaHuang", 1],
  ["sstchur", 1],
  ["Zzzen", 4],
  ["jihndai", 1],
  ["ForbesLindesay", 1],
  ["gulewei", 1],
  ["islandryu", 1],
  ["nebkat", 1],
  ["dhritzkiv", 1],
  ["dsherret", 2],
  ["bakkot", 1],
  ["saschanaz", 1],
  ["FlyingPumba", 1],
  ["lpizzinidev", 1],
  ["donaldnevermore", 1],
  ["nicolas377", 1],
  ["iinicole", 1],
  ["nicenandneat", 1],
  ["eps1lon", 1],
  ["KhafraDev", 1],
  ["Solo-steven", 1],
  ["noshiro-pf", 1],
];
const newbies = [
  "apendua",
  "simllll",
  "fishcharlie",
  "jonathanKingston",
  "jasonlyu123",
  "Eyal-Shalev",
  "gmanninglive",
  "ericbf",
  "abuob",
  "zardoy",
  ["ronyhe", 1],
  ["m-basov", 1],
  ["jadestrong", 1],
  ["Tobias-Scholz", 4],
  ["OliverRadini", 1],
  ["jespertheend", 1],
  ["sroucheray", 1],
  ["matiasosorio1999", 1],
  ["joaosantos99", 1],
  ["pyBlob", 1],
  ["pnacht", 2],
  ["graphemecluster", 3],
  ["brendaHuang", 1],
  ["sstchur", 1],
  ["ForbesLindesay", 1],
  ["gulewei", 1],
  ["nebkat", 1],
  ["dhritzkiv", 1],
  ["lpizzinidev", 1],
  ["donaldnevermore", 1],
  ["iinicole", 1],
  ["nicenandneat", 1],
  ["eps1lon", 1],
  ["KhafraDev", 1],
  ["Solo-steven", 1],
  ["noshiro-pf", 1],
];
const jsts = ["MarioSolOs", "zkat"];
let sum = 0;
contrib.sort(([_, m], [__, n]) => (m < n ? 1 : -1));
for (const [_, n] of contrib) {
  sum += n;
}
console.log(contrib.slice(0, 10));
console.log("Total contributors", contrib.length);
console.log("New contributors", newbies.length);
console.log("Returning contributors:", contrib.length - newbies.length);
console.log("Total PRs merged:", sum);
console.log("Outside contributor rate:", sum / 700);
console.log("PRs per day", 670 / (356 / 2));
