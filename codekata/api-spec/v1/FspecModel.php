<?php
namespace Service\Fspec\Models;

use Illuminate\Support\Collection;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use Carbon\Carbon;
use Symfony\Component\Yaml\Yaml;

class FspecModel
{
    protected $name;
    protected $source;
    protected $fileType;
    protected $attributes = [];
    protected $nested;
    protected $collection;
    protected $file;
    protected $updatedAt;

    public function __construct()
    {
        $this->collection = new Collection();
    }

    public function all()
    {
        $this->load();
        return [
            $this->name => $this->collection->toArray(),
        ];
    }

    public function find($id)
    {
        $this->load();
        $feature = $this->collection->filter(function ($item) use ($id) {
            return array_get($item, 'id') === urldecode($id);
        });
        return [
            $this->name => [$feature->first()],
        ];
    }

    public function filterByName($name)
    {
        $this->load();
        $feature = $this->collection->filter(function ($item) use ($name) {
            return array_get($item, 'name') === $name;
        });
        return [
            $this->name => $feature->all(),
        ];
    }

    protected function load()
    {
        // Use loaded version if it was already loaded once
        if ($this->collection->count()) {
            return;
        }

        if (! file_exists($this->source)) {
          return;
        }
        $finder = (new Finder())->followLinks();
        $finder->in($this->source)->name('*.'. $this->fileType)->files();

        foreach ($finder as $file) {
            $this->map($file);
        }
    }

    protected function parseData($content)
    {
        return $data = Yaml::parse($content);
    }

    protected function mapModel($data)
    {
        $model = [];
        foreach ($this->attributes as $attribute) {
            $method = "setAttribute" . studly_case($attribute);
            if (method_exists($this, $method)) {
                $model[$attribute] = $this->$method($data);
            } else {
                $model[$attribute] = array_get($data, $attribute);
            }
        }
        return $model;
    }

    protected function setAttributeUpdatedAt($data)
    {
        return $this->updatedAt;
    }

    protected function setAttributeId($data)
    {
        $fileName = $this->file->getRelativePathname();
        $id = str_replace(".".$this->fileType, "", $fileName);
        $id = str_replace("/", "-", $id);
        return kebab_case($id);
    }

    protected function setAttributeDepth($data)
    {
        return 0;
    }

    protected function setAttributeRoutes($data)
    {
        $routes = $data['routes'];
        foreach ($routes as $k => $route) {
            $routes[$k]['id'] = md5('route' . $routes[$k]['name']);
            if (!empty($route['requests'])) {
                foreach ($route['requests'] as $k2 => $request) {
                    if (!empty($request['payloadFile'])) {
                        $content = file_get_contents($this->source .'/' . $request['payloadFile']);
                        if (array_get($request, 'type') === 'raw') {
                            $routes[$k]['requests'][$k2]['payload'] = $content;
                        } else {
                            $routes[$k]['requests'][$k2]['payload'] = json_decode($content, true);
                        }
                    }
                }
            }
        }

        return $routes;
    }

    protected function nested($model, $data)
    {
        if ($nested = $this->nested) {
            $nestedData = array_get($data, $nested, []);
            $model[$nested] = $this->setNested($nested, $nestedData, array_get($model, 'id'));
        }
        return $model;
    }

    protected function setIdFromName($model, $prefix = "")
    {
        $id = array_get($model, 'name');
        $id = kebab_case($id);
        if (! empty($prefix)) {
          $id = "$prefix-$id";
        }
        $model['id'] = $id;
        return $model;
    }

    protected function setIdFromFileName($model, $fileName)
    {
        $id = str_replace(".".$this->fileType, "", $fileName);
        $id = str_replace("/", "-", $id);
        $id = kebab_case($id);
        $model['id'] = $id;
        return $model;
    }

    protected function setNested($nested, array $data, $prefix = "", $depth = 0)
    {
        $ids = [];
        $newDepth = $depth + 1;
        foreach ($data as $item) {
            if (is_string($item)) {
                if (strpos($item, '.'.$this->fileType) !== false) {
                    $model = $this->setIdFromFileName([], $item);
                    // no push here because this is just file reference and should already get added
                } else {
                    // push just name to collection
                    $data = ['name' => $item];
                    $model = $this->mapModel($data);
                    $model = $this->setIdFromName($model, $prefix);
                    $model['depth'] = $newDepth;
                    $model[$nested] = [];
                    $this->collection->push($model);
                }
            } else {
                $model = $this->mapModel($item);
                $model = $this->setIdFromName($model, $prefix);
                $model['depth'] = $newDepth;

                $data = array_get($item, $nested, []);
                if (! empty($data)) {
                    $data = $this->setNested($nested, $data, array_get($model, 'id'), $newDepth);
                }
                $model[$nested] = $data;

                $this->collection->push($model);
            }

            $ids[] = array_get($model, 'id');
            unset($model);
        }

        return $ids;
    }

    protected function map(SplFileInfo $file)
    {

        $content = $file->getContents();
        $data = $this->parseData($content);

        // setup path and category
        $data['path'] = $path = $file->getPath();
        $data['filename'] = $file->getFilename();
        $category = str_replace($this->source, "", $path);
        $category = trim($category, "/");
        $data['category'] = $category;

        // file updatedAt
        $this->file = $file;
        $this->updatedAt = Carbon::createFromTimestamp($file->getMTime())->toDateTimeString();

        // file's model
        $model = $this->mapModel($data);
        $model = $this->nested($model, $data);

        $this->collection->push($model);
    }
}
