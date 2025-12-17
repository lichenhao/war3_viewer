import { extname } from "../../../src/common/path";
import War3Map from "../../../src/parsers/w3x/map";
import UnitsDooFile from "../../../src/parsers/w3x/unitsdoo/file";
import UnitsDooUnit from "../../../src/parsers/w3x/unitsdoo/unit";
import Context from '../../../src/utils/jass2/context';
import JassUnit from '../../../src/utils/jass2/types/unit';
import Component from "../../shared/component";
import { createElement } from "../../shared/domutils";
import { aFrame } from "../../shared/utils";
import localResourceLoader from "../../shared/localresource";

export default class Rebuilder extends Component {
  constructor(parentElement) {
    super();

    this.commonjText = '';
    this.blizzardjText = '';
    this.ready = false;

    this.load();

    parentElement.appendChild(this.container);
  }

  async load() {
    this.text('Fetching files: "Scripts\\common.j", "Scripts\\Blizzard.j"');
    this.text('Please wait...');

    try {
      // Load common.j with local caching through proxy
      const commonjText = await localResourceLoader.load('scripts/common.j');
      
      // Load blizzard.j with local caching through proxy
      const blizzardjText = await localResourceLoader.load('scripts/blizzard.j');

      this.commonjText = commonjText;
      this.blizzardjText = blizzardjText;

      this.text('Ready, drag and drop a map (*.w3m, *.w3x) anywhere on the page.');
    } catch (error) {
      console.error('Failed to load script files:', error);
      this.text('Error loading script files. Please check the console for details.');
    }
  }

  clear() {
    this.container.innerHTML = '';
  }

  text(text) {
    createElement({ textContent: text, container: this.container });
  }

  rebuildFile(file) {
    if (file) {
      const name = file.name;
      const ext = extname(name);
      const isMap = ext === '.w3m' || ext === '.w3x';

      this.clear();

      if (isMap) {
        this.text(`Reading ${name}`);

        const reader = new FileReader();

        reader.addEventListener('loadend', async (e) => {
          const buffer = e.target.result;

          this.text(`Parsing ${name}`);

          const map = new War3Map();

          try {
            map.load(buffer);
          } catch (e) {
            this.text(`Failed to parse: ${e}`);

            return;
          }

          const context = new Context();

          this.text('Converting and running common.j');
          await aFrame();
          context.run(this.commonjText, true);

          this.text('Converting and running Blizzard.j');
          await aFrame();
          context.run(this.blizzardjText, true);

          this.text('Converting and running war3map.j');
          await aFrame();
          context.open(map);

          this.text('Running config()');
          await aFrame();
          context.call('config');

          this.text('Running main()');
          await aFrame();
          context.call('main');

          this.text('Collecting handles');
          await aFrame();

          const unitsFile = new UnitsDooFile();
          const units = unitsFile.units;

          for (const handle of context.handles) {
            if (handle instanceof JassUnit) {
              const unit = new UnitsDooUnit();

              unit.id = handle.unitId;

              unit.location[0] = handle.x;
              unit.location[1] = handle.y;
              // For z need the height of the terrain!

              unit.angle = handle.face / 180 * Math.PI;

              unit.player = handle.player.index;

              unit.targetAcquisition = handle.acquireRange;

              units.push(unit);
            }
          }

          this.text(`Saving war3mapUnits.doo with ${units.length} objects`);
          await aFrame();
          map.set('war3mapUnits.doo', unitsFile.save(false));

          this.text('Finished');

          saveAs(new Blob([map.get('war3mapUnits.doo').arrayBuffer()], { type: 'application/octet-stream' }), 'war3mapUnits.doo');
        });

        reader.readAsArrayBuffer(file);
      } else {
        this.text(`${name} is not a map`);
      }
    }
  }
}
