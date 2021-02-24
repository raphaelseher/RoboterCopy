package com.example.myapplication.screens.home

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import com.example.myapplication.AppEnvironment
import com.example.myapplication.R
import com.example.myapplication.databinding.FragmentHomeBinding
import com.example.myapplication.extensions.deviceName
import com.example.myapplication.getViewModel

class HomeFragment : Fragment() {

    private val viewModel: HomeViewModel by lazy {
        getViewModel { HomeViewModel(AppEnvironment.copyRepository, deviceName()) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupObservers()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        val binding: FragmentHomeBinding = DataBindingUtil.inflate(inflater, R.layout.fragment_home,
            container, false)
        binding.lifecycleOwner = this
        binding.viewModel = viewModel
        binding.presenter = Presenter(
            onClickConnect = { viewModel.onClickConnect() },
            onClickChangeServer = { showServerSelectionModal() }
        )
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }

    private fun setupObservers() {
        viewModel.copyRepository.servers.observe(this) {
            Log.d("HomeFragment", "Servers changed: $it")
        }
    }

    private fun showServerSelectionModal() {
        Toast.makeText(requireContext(), "Server selection modal", Toast.LENGTH_SHORT).show()
    }

    class Presenter(
        val onClickConnect: () -> Unit,
        val onClickChangeServer: () -> Unit
    )
}
