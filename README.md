# uplr - simple image hosting

uplr is a very minimal image hosting service. It has no dependencies and
consumes very few resources.

## Installation

To run uplr:
```
node server
```

You will also need a reverse proxy such as `nginx` to handle HTTPS and file
delivery. A sample configuration is included in this repository.

## Usage

To upload:

```
curl -H "x-uplr: API_KEY" --data-binary @file.png https://uplr.it/
```

## Configuration

By default, all files are saved in the `img` directory.

As a basic protection measure, uplr uses a private API key as an access token.

## License

![GPLv3](https://www.gnu.org/graphics/gplv3-127x51.png)

uplr is licensed under the [GNU General Public License
3.0](https://www.gnu.org/licenses/gpl-3.0.txt) or later, at your
option.
