'use client';

import { useEffect, useState } from 'react';
import { BarChart } from '../components/Chart';
import { useToastContext } from '../providers/toast';
import { IToastType } from 'src/types/ToastType';
import { IChartData } from '../../types/ChartData';
import { filterDataset } from 'src/constants/filterDataset';

const defaultLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June'];

export function ChartBlock() {
  const [chartData, setChartData] = useState<IChartData | null>(null);
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  const { renderToast } = useToastContext();

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const response = await fetch('http://localhost:3001/api/data/chart-data');
      const data = await response.json();
      setChartData(data.data);

      data.status === IToastType.SUCCESS
        ? renderToast(IToastType.SUCCESS, data.message)
        : renderToast(IToastType.ERROR, data.message);
    } catch (error: any) {
      renderToast(IToastType.ERROR, error.message || 'An unknown error occurred');
    }
  }

  const filterData = (): IChartData => {
    if (!chartData) {
      return { datasetOne: [], datasetTwo: [] };
    }

    const filteredDatasetOne = filterDataset(chartData?.datasetOne, minValue, maxValue);
    const filteredDatasetTwo = filterDataset(chartData?.datasetTwo, minValue, maxValue);

    return { datasetOne: filteredDatasetOne, datasetTwo: filteredDatasetTwo };
  };

  const filteredLabels = () => {
    const firstDatasetLength = filterData().datasetOne.length;
    const secondDatasetLength = filterData().datasetTwo.length;
    let newLabels;

    if (firstDatasetLength > secondDatasetLength) {
      newLabels = defaultLabels.slice(0, firstDatasetLength);
    } else if (secondDatasetLength > firstDatasetLength) {
      newLabels = defaultLabels.slice(0, secondDatasetLength);
    } else {
      newLabels = defaultLabels;
    }

    return newLabels;
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(e.target.value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(e.target.value);
  };

  const handleReset = () => {
    setMinValue('');
    setMaxValue('');
  };

  return (
    <div>
      <div className='mb-12 flex items-center'>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Min</span>
          <input type='number' className='w-24 h-8 text-sm' value={minValue} onChange={handleMinChange} />
        </div>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Max</span>
          <input type='number' className='w-24 h-8 text-sm' value={maxValue} onChange={handleMaxChange} />
        </div>
        <div className='flex flex-col mx-4 pt-4 w-100'>
          <button
            className='bg-blue-600 flex justify-center items-center h-10 text-center text-white border focus:outline-none focus:ring-4 font-sm rounded-lg text-sm px-5 py-1.9'
            onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div>
        <BarChart
          width={600}
          height={300}
          data={{
            labels: filteredLabels(),
            datasets: [
              {
                label: 'Dataset 1',
                data: filterData().datasetOne,
                backgroundColor: 'rgb(255, 99, 132)',
              },
              {
                label: 'Dataset 2',
                data: filterData().datasetTwo,
                backgroundColor: 'rgb(54, 162, 235)',
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
