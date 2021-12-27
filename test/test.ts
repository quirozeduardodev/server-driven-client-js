import {ServerDrivenClient} from "../src";

class Test {

    xml = `
        <ServerDriven version="1.0.0">
          <Column>
            <Text>Fecha</Text>
            <TextField placeholder=""/>
            <Text>Orden de Trabajo</Text>
            <TextField placeholder="Orden de trabajo"/>
            <Text>Nombre</Text>
            <TextField placeholder="Nombre"/>
            <Text>WWID</Text>
            <TextField placeholder="WWID"/>
            <Text>Unidad de Negocio</Text>
            <Dropdown>
              {{#each businessUnities}}
              <Option value="{{this.id}}">{{this.name}}</Option>
              {{/each}}
            </Dropdown>
            <Row>
              <Text>¿Esta acompañado?</Text>
              <Switch/>
            </Row>
            <Text>Externo</Text>
            <TagEdit/>
            <Text>Categoria de la tarea</Text>
            <Dropdown placeholder="Categoria de la tarea">
              {{#each taskCategories}}
              <Option value="{{this.id}}">{{this.name}}</Option>
              {{/each}}
            </Dropdown>
            <Text>Descripción de la tarea</Text>
            <TextField placeholder="Descripción de la tarea"/>
            <Text>Ingresa tu ubicación</Text>
            <TextField placeholder="Ingresa tu ubicación"/>
          </Column>
        </ServerDriven>
    `;

    classJs = `class Test{}`

    public run(): void {
        const sd: ServerDrivenClient =  new ServerDrivenClient(this.xml, this.classJs, 'Test');
        sd.view.subscribe(value => {
          console.log(value);
        });
        setTimeout(args => {

        }, 500);
    }


}

const test = new Test();
test.run();
console.log('Done');